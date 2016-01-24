import json

from django.db import models
from django.conf import settings
import requests

import xml.etree.ElementTree as ElementTree # For RtmpStatus._parse_response

class Movie(models.Model):
    tmdb_id = models.IntegerField('TMDB ID')

    # TODO: Eventually associate with actual users once registration is up
    user = models.CharField('Who selected this god awful movie', max_length=80)
    date = models.DateField('Date Played')

    _tmdb_data = None

    @classmethod
    def get_latest(cls):
        """Retrieve the latest movie played """
        return cls.objects.order_by('-date')[0]

    @classmethod
    def get_all_for_month(cls, month, year):
        """Retrieve movies that have been played within a given month """
        return cls.objects.filter(date__year=year, date__month=month)

    @property
    def tmdb_data(self):
        """ Additional data provided by TMDB """
        if not self._tmdb_data:
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

        if 'backdrop_path' in self.tmdb_data['details']:
            return 'https://image.tmdb.org/t/p/w780{}'.format(
                self.tmdb_data['details']['backdrop_path']
            )

        return 'DEFAULT'

    @property
    def poster_url(self):
        """Shorthand for retrieving the backdrop image url """
        
        if 'poster_path' in self.tmdb_data['details']:
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
        if 'details' in self.tmdb_data:
            title = self.tmdb_data['details']['title']
        else:
            title = 'Unknown TMDB ID ({})'.format(self.tmdb_id)

        return '"{title}" picked by {user}'.format(
            title=title,
            user=self.user
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

        return parsed

