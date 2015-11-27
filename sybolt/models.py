
from datetime import date, datetime
import json
from hashlib import sha256

from sqlalchemy import Column, ForeignKey

# Column data types
from sqlalchemy import Integer, String, Date, DateTime, Enum

from sqlalchemy import cast, func
from sqlalchemy.orm import relationship

from flask.ext.login import UserMixin

from .database import Base, db_session

from sybolt import app

class Movie(Base):
    __tablename__ = 'movie'
    id = Column(Integer, primary_key=True)
    tmdb_id = Column(Integer)
    profile = Column(String(80))
    date = Column(Date)
    krampus_votes = relationship('KrampusVote')

    _tmdb_data = None

    def __init__(self, tmdb_id, profile, date):
        self.tmdb_id = tmdb_id
        self.profile = profile
        self.date = date

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

    @classmethod
    def get_latest(cls):
        """ Retrieve the latest movie tracked """
        return cls.query\
            .order_by(cls.date.desc())\
            .first()

    @classmethod
    def get_all_for_month(cls, month, year):
        """ Retrieve movies that have been played within a month """

        search_month = date(int(year), int(month), 1)
        if int(month) < 12:
            next_month = date(int(year), int(month) + 1, 1)
        else:
            next_month = date(int(year) + 1, 1, 1)

        # Create a subquery to also load krampusvote counts for each
        # subquery = db_session.query(KrampusVote.movie_id, func.count('*')\
        #     .label('krampusvote_count'))\
        #     .group_by(KrampusVote.movie_id)\
        #     .subquery()

        # app.logger.debug(subquery.c)

        # results = db_session.query(cls, subquery.c.krampusvote_count)\
        #     .filter(cls.date.between(search_month, next_month))\
        #     .outerjoin(subquery, cls.id==subquery.c.movie_id)\
        #     .order_by(cls.date)\
        #     .all()

        # # Merge krampusvote counts into movie data
        # for movies, counts in results:
        #     movie.krampus_votes =

        movies = cls.query\
            .filter(cls.date.between(search_month, next_month))\
            .order_by(cls.date)\
            .all()

        return movies

    def _load_tmdb_data(self):
        """ Load and cache additional movie data from TMDB """
        data = {}
        cache_path = app.config['TMDB_CACHE_PATH']

        try:
            with open('{}/{}.json'.format(cache_path, self.tmdb_id)) as f:
                data = json.loads(f.read())

        except FileNotFoundError:
            # If the movie isn't cached, try to load from TMDB
            try:
                from sybolt.tmdb_api import cache_movie
                data = cache_movie(
                    app.config['TMDB_API_KEY'], 
                    cache_path, 
                    self.tmdb_id
                )
            except:
                data = None

        self._tmdb_data = data

class KrampusVoteError(Exception):
    """ Exception class that is thrown by KrampusVote """
    def __init__(self, message):
        self.message = message

    def __str__(self):
        return self.message

class KrampusVote(Base):
    __tablename__ = 'krampusvote'
    id = Column(Integer, primary_key=True)

    # The voter
    profile_id = Column(Integer, ForeignKey('profile.id'))
    profile = relationship('Profile', backref='krampus_votes')

    # The target (eventually a profile ref?)
    target = Column(String(30))

    # If vote_type == movie, this is set
    movie_id = Column(Integer, ForeignKey('movie.id'), nullable=True)

    # When the vote was added. If they're doing daily
    # votes, we get all matches for the current date to
    # test whether they can create additional votes
    date = Column(Date)

    vote_type = Column(Enum('naughty', 'nice'))

    # What type of vote was made. People can either do
    # N daily votes, or a movie vote for some movie_id
    # that has Movie.profile == self.profile and 
    # Movie.date > 12-25-2014
    vote_group = Column(Enum('movie', 'daily'))

    @classmethod
    def votes_today(cls, profile):
        """ Return the number of daily votes made today """
        return cls.query\
            .filter(cls.date == date.today())\
            .filter(cls.vote_group == 'daily')\
            .filter(cls.profile_id == profile.id)\
            .count()

    @classmethod
    def total_votes(cls, profile):
        return cls.query\
            .filter(cls.profile_id == profile.id)\
            .count()

    @classmethod
    def has_voted_on_movie(cls, profile, movie):
        return cls.query\
            .filter(cls.profile_id == profile.id)\
            .filter(cls.movie_id == movie.id)\
            .count() > 0

    @classmethod
    def vote_movie(cls, movie, profile, type):

        # Ensure they haven't voted on this movie yet
        if cls.has_voted_on_movie(profile, movie):
            raise KrampusVoteError(
                'You already voted on this movie'
            )

        vote = cls()
        vote.profile = profile
        vote.target = movie.profile
        vote.vote_group = 'movie'
        vote.movie_id = movie.id
        vote.date = datetime.now()
        vote.vote_type = type

        db_session.add(vote)
        db_session.commit()

        return vote

    @classmethod
    def vote_daily(cls, username, voter, type):
        
        # Ensure they can actually vote again
        if cls.votes_today(voter) > 1:
            raise KrampusVoteError(
                'You have reached your maximum (2) votes today'
            )

        vote = cls()
        vote.profile = voter
        vote.target = username
        vote.date = datetime.now()
        vote.vote_group = 'daily'
        vote.vote_type = type

        db_session.add(vote)
        db_session.commit()

        return vote

    @classmethod
    def apply_votes_to_movies(cls, profile, movies):
        """ Apply naughty/nice votes for each movie for the given user """

        votes = cls.query\
            .filter(cls.profile_id == profile.id)\
            .filter(cls.movie_id.in_([m.id for m in movies]))\
            .all()

        for m in movies:
            for vote in votes:
                if vote.movie_id == m.id:
                    m.krampusvote = vote.vote_type
                    break
            else:
                m.krampusvote = None

class LoginRecord(Base):
    """ Tracking logins for profiles """
    __tablename__ = 'login_record'
    id = Column(Integer, primary_key=True)
    profile_id = Column(Integer, ForeignKey('profile.id'))
    profile = relationship('Profile', backref='login_records')

    date = Column(DateTime)
    ip = Column(String(15))


    # TODO: Append geographic information for better display
    # (i.e. "Login at [time] from [location] [ip]")
    # Check out http://ip-api.com/docs/api:json
    # Could probably just do this on the frontend. 

class Profile(Base, UserMixin):
    """ A user profile """
    __tablename__ = 'profile'
    id = Column(Integer, primary_key=True)
    email = Column(String(200))

    # Display name, changeable by the user
    nickname = Column(String(64))

    # Sha256 digest of the password + secret
    _password = Column('password', String(64))

    # Associated account names (eventually DB relationships) 
    murmur_username = Column(String(32))

    # Generated via https://api.mojang.com/users/profiles/minecraft/{minecraft_username}
    minecraft_uuid = Column(String(36))
    minecraft_username = Column(String(16))

    @property
    def password(self):
        return self._password

    @password.setter
    def password(self, password):
        """ Setter to enforce encryption on stored passwords """
        self._password = Profile.crypt(password)

    def get_id(self):
        """ Returns a unicode to uniquely identify the user.
            
        Required by Flask-Login UserMixin
        """
        return str(self.id)

    # TODO: Move to general utilities
    @staticmethod
    def crypt(value):
        """ Get an encryption digest on a value as a hex digest 

        Params:
            value: Plaintext string to encode
        """

        crypted = sha256()
        crypted.update(value.encode('utf-8'))
        crypted.update(app.config['PASSWORD_SALT'].encode('utf-8'))

        return crypted.hexdigest()

    def minecraft_body_url(self, scale = 4):

        # Yay for third party APIs
        return 'https://crafatar.com/renders/body/{}?overlay&scale={}'.format(
            self.minecraft_uuid, 
            scale
        )

    def minecraft_head_url(self, size = 64):

        # Yay for third party APIs
        return 'https://crafatar.com/avatars/{}?size={}&overlay'.format(
            self.minecraft_uuid, 
            size
        )

    def get_recent_login_records(self, count):
        """ Returns `count` recent LoginRecord entries for this profile """
        
        return LoginRecord.query\
            .filter(LoginRecord.profile_id == self.id)\
            .order_by(LoginRecord.date)\
            .limit(count)\
            .all()

