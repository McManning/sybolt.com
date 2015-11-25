
from datetime import date, datetime
import json

from sqlalchemy import Column, Integer, String, Date, Enum, ForeignKey

from sqlalchemy import cast, func
from sqlalchemy.orm import relationship

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
    profile = Column(String(80))

    # Tracker for who voted. This *may* get cross
    # referenced with Murmur to scope access to only
    # active members. 
    ip = Column(String(15))

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

    # If vote_type == movie, this is set
    movie_id = Column(Integer, ForeignKey('movie.id'), nullable=True)

    @classmethod
    def votes_today(cls, ip):
        """ Return the number of daily votes made today """
        return cls.query\
            .filter(cls.date == date.today())\
            .filter(cls.vote_group == 'daily')\
            .filter(cls.ip == ip)\
            .count()

    @classmethod
    def total_votes(cls, ip):
        return cls.query\
            .filter(cls.ip == ip)\
            .count()

    @classmethod
    def has_voted_on_movie(cls, ip, movie_id):
        return cls.query\
            .filter(cls.ip == ip)\
            .filter(cls.movie_id == movie_id)\
            .count() > 0

    @classmethod
    def vote_movie(cls, movie, ip, type):

        # Ensure they haven't voted on this movie yet
        if cls.has_voted_on_movie(ip, movie.id):
            raise KrampusVoteError(
                'You already voted on this movie'
            )

        vote = cls()
        vote.profile = movie.profile
        vote.ip = ip
        vote.vote_group = 'movie'
        vote.movie_id = movie.id
        vote.date = datetime.now()
        vote.vote_type = type

        db_session.add(vote)
        db_session.commit()

        return vote

    @classmethod
    def vote_daily(cls, profile, ip, type):
        
        # Ensure they can actually vote again
        if cls.votes_today(ip) > 1:
            raise KrampusVoteError(
                'You have reached your maximum (2) votes today'
            )

        vote = cls()
        vote.profile = profile
        vote.ip = ip
        vote.date = datetime.now()
        vote.vote_group = 'daily'
        vote.vote_type = type

        db_session.add(vote)
        db_session.commit()

        return vote

    @classmethod
    def apply_votes_to_movies(cls, ip, movies):
        """ Apply naughty/nice votes for each movie for the given user """

        votes = cls.query\
            .filter(cls.ip == '127.0.0.1')\
            .filter(cls.movie_id.in_([m.id for m in movies]))\
            .all()

        for m in movies:
            for vote in votes:
                if vote.movie_id == m.id:
                    m.krampusvote = vote.vote_type
                    break
            else:
                m.krampusvote = None
