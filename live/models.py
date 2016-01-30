import json
from datetime import datetime

from django.db import models, connection
from django.conf import settings
import requests

import xml.etree.ElementTree as ElementTree # For RtmpStatus._parse_response

class Movie(models.Model):
    tmdb_id = models.IntegerField('TMDB ID, leave blank for just slotting time', null=True, blank=True)

    # TODO: Eventually associate with actual users once registration is up
    user = models.CharField('Who selected this god awful movie', max_length=80, blank=True)
    date = models.DateField('Date Played', blank=False)

    _tmdb_data = None
    _recent_user_movies = None

    @classmethod
    def get_latest_played(cls):
        """Retrieve the latest movie played """
        return cls.objects.exclude(tmdb_id__isnull=True).order_by('-date')[0]

    @classmethod
    def get_all_for_month(cls, month, year):
        """Retrieve movies that have been played within a given month """
        return cls.objects.filter(date__year=year, date__month=month).order_by('date')

    @classmethod
    def get_recent_users(cls, count):
        """ Retrieve the last count users that picked movies """
        return [
            x.user for x in cls.objects \
                .exclude(tmdb_id__isnull=True) \
                .exclude(user='') \
                .order_by('-date') \
                .only('user')[:3]
        ]

    def get_recent_movies_for_user(self):
        """ Retrieve last 3 movies related to the user """
        if self._recent_user_movies:
            return self._recent_user_movies

        self._recent_user_movies = Movie.objects \
            .filter(user=self.user) \
            .exclude(tmdb_id__isnull=True) \
            .order_by('-date')[:3]

        return self._recent_user_movies

    @classmethod
    def get_user_suggestions(cls):
        """ Retrieve suggestions on who to pick for the next movie
            
            The algorithm works as follows:
            1. Retrieve a list of users that have selected a movie in 
                the past, along with the last pick date and total number
                of movies "officially" selected for movie night
            2. Perform cutoffs of "guest" individuals, who have picked
                a low number of movies, but aren't consistent enough to
                be considered in the selection process.
            3. Perform cutoffs of individuals that have recently picked
            4. The remaining pool is weighed by combining the distance
                from today and the inverse of the total number of picks
            5. Select the top three from that list.  
        """
        cursor = connection.cursor()

        cursor.execute("""
            SELECT 
                user,        
                last_date, 
                frequency,
                date_distance,
                (date_distance / frequency) AS weight
            FROM (
                -- Calculate frequencies and distances
                SELECT 
                    user,       
                    MAX(date) AS last_date,
                    COUNT(date) AS frequency,         
                    (JulianDay('now') - JulianDay(MAX(date))) AS date_distance
                FROM live_movie
                WHERE user <> '' AND tmdb_id IS NOT NULL
                GROUP BY user
                ORDER BY date_distance ASC  
                LIMIT -1 OFFSET 4 -- Slice off 4 most recent
            )
            WHERE frequency > 2 -- Slice off guests outside aggregate
            ORDER BY weight DESC -- Apply weight algorithm
            LIMIT 3; -- Return top 3 results
        """)

        columns = [col[0] for col in cursor.description]
        rows = [dict(zip(columns, row)) for row in cursor.fetchall()]
        for row in rows:
            row['last_date'] = datetime.strptime(row['last_date'], '%Y-%m-%d')

        return rows

    @property
    def tmdb_data(self):
        """ Additional data provided by TMDB """
        if not self._tmdb_data and self.tmdb_id:
            self._load_tmdb_data()

        return self._tmdb_data

    @property
    def short_date(self):
        """ Returns the movie date formatted as `NOV 10` """
        return '{} {}'.format(
            self.date.strftime('%B')[:3].upper(), 
            self.date.day
        )

    @property
    def backdrop_url(self):
        """Shorthand for retrieving the backdrop image url """

        if self.tmdb_data and 'backdrop_path' in self.tmdb_data['details']:
            return 'https://image.tmdb.org/t/p/w780{}'.format(
                self.tmdb_data['details']['backdrop_path']
            )

        return 'DEFAULT'

    @property
    def poster_url(self):
        """Shorthand for retrieving the backdrop image url """
        
        if self.tmdb_data and 'poster_path' in self.tmdb_data['details']:
            return 'https://image.tmdb.org/t/p/w154{}'.format(
                self.tmdb_data['details']['poster_path']
            )

        return 'DEFAULT'

    @property
    def tmdb_data(self):
        """Pull movie data from TMDB and cache locally 

            If TMDB responds with an error (bad key, bad id, etc), 
            this will throw an Exception with the error details. 

            Otherwise, the json will be cached to disk and returned
        """
        if self._tmdb_data:
            return self._tmdb_data

        if not self.tmdb_id:
            return None

        cache_path = '{}/{}.json'.format(
            settings.TMDB_CACHE_PATH, 
            self.tmdb_id
        )

        # Try loading the cache from disk
        try:
            with open(cache_path) as f:
                self._tmdb_data = json.loads(f.read())
            
            return self._tmdb_data
        except (FileNotFoundError, ValueError):
            # Nothing cached, create a new one from TMDB's API
            pass

        details = requests.get(
            '{}/{}'.format(settings.TMDB_API_URI, self.tmdb_id), 
            params = {'api_key': settings.TMDB_API_KEY}
        ).json()

        videos = requests.get(
            '{}/{}/videos'.format(settings.TMDB_API_URI, self.tmdb_id), 
            params = {'api_key': settings.TMDB_API_KEY}
        ).json()

        # Check for errors from the API (bad key, bad id, etc)
        if 'status_message' in details:
            raise Exception('TMDB API Error (details endpoint): ' + details['status_message'])

        if 'status_message' in videos:
            raise Exception('TMDB API Error (videos endpoint): ' + details['status_message'])

        self._tmdb_data = {
            'details': details,
            'videos': videos['results']
        }

        # Cache our TMDB response to disk
        with open(cache_path, 'w') as f:
            f.write(json.dumps(
                self._tmdb_data,
                sort_keys=True, 
                indent=4
            ))

        return self._tmdb_data

    def __str__(self):
        """Render out a description of this record 
            
            Used by Django admin to display editable records
        """
        if not self.tmdb_data:
            title = 'Literally nothing'
        elif 'details' in self.tmdb_data:
            title = self.tmdb_data['details']['title']
        else:
            title = 'Unknown TMDB ID ({})'.format(self.tmdb_id)

        return '"{title}" picked by {user}'.format(
            title=title,
            user=self.user or 'nobody yet'
        )


class RtmpStatus:
    """Status retriever and parser for Nginx RTMP streams """

    def __init__(self):
        self.status = None
        self.update()

    def update(self):
        """Retrieve and parse the current RTMP stream status """
        r = requests.get(settings.RTMP_STATUS_URI)
        r.raise_for_status()

        # Do some parsing work since XML sux
        self.status = self._parse_response(r.text)

    def _parse_response(self, text):
        """Converts XML status response to dict """
        parsed = {}

        # Parse the status into something we can serve as JSON
        root = ElementTree.fromstring(text)

        # Assumption is that there is only one application (live)
        # running (for now) as I don't have the bandwidth to 
        # support more
        app = root.find('server').find('application')
        
        stream = app.find('live').find('stream')
        if stream is not None:
            # stream.find('name') is the Stream Key from OBS (current set to "test")
            # Eventually, this'll be some sort of identifier for who's streaming.
            parsed['stream_path'] = stream.find('name').text
            parsed['publishing'] = (stream.find('publishing') != None)
            
            # Video/Audio statistics
            meta = stream.find('meta')
            if meta != None:
                video = stream.find('meta').find('video')
                audio = stream.find('meta').find('audio')
                
                parsed['video'] = dict(
                    width=video.find('width').text,
                    height=video.find('height').text,
                    frame_rate=video.find('frame_rate').text,
                    codec=video.find('codec').text
                    # Not included: profile, compat, level
                )
                
                parsed['audio'] = dict(
                    codec=audio.find('codec').text,
                    profile=audio.find('profile').text,
                    channels=audio.find('channels').text,
                    sample_rate=audio.find('sample_rate').text
                )
            
            # Current clients watching or publishing
            parsed['clients'] = []
            
            count = 0
            for client in stream.findall('client'):
                if client.find('publishing') != None:
                    # If we found the streamer himself, log it separately
                    # @todo link with a User if possible
                    parsed['publisher'] = dict(
                        ip = client.find('address').text
                    )
                else:
                    # Log a watcher
                    # @todo link with a User if possible
                    parsed['clients'].append(dict(
                        ip = client.find('address').text
                    ))
        else: # if !stream
            # The stream is just completely dead (no viewers, no publishers)
            parsed['publishing'] = False

        # Add some additional metadata
        parsed['rtmp_url'] = 'rtmp://sybolt.com:1935/live'

        return parsed

