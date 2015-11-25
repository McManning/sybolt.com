
from datetime import date, datetime
import json

from sqlalchemy import Column, Integer, String, Date, Enum
from .database import Base, db_session

from sybolt import app

class Movie(Base):
    __tablename__ = 'movie'
    id = Column(Integer, primary_key=True)
    tmdb_id = Column(Integer)
    profile = Column(String(80))
    date = Column(Date)

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

        # Pull up all movies in our database within the specified month
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

    # If vote_type == movie, 
    movie_id = Column(Integer, nullable=True)

    @classmethod
    def votes_today(kv, ip):
        return kv.query\
            .filter(kv.date == datetime.now())\
            .filter(kv.ip == ip)\
            .count()

    @classmethod
    def total_votes(kv, ip):
        return kv.query\
            .filter(kv.ip == ip)\
            .count()

    @classmethod
    def has_voted_on_movie(kv, ip, movie_id):
        return kv.query\
            .filter(kv.ip == ip)\
            .filter(kv.movie_id == movie_id)\
            .count() > 0

    @classmethod
    def vote(kv, movie, ip, type):

        # Create a new vote entry or edit an existing one
        vote = kv.query\
            .filter(kv.movie_id == movie.id)\
            .filter(kv.ip == ip)\
            .first()

        # If we don't have an entry yet, create a new one
        # and populate fields that don't change between votes
        if not vote:
            vote = kv()
            vote.profile = movie.profile
            vote.ip = ip
            vote.vote_group = 'movie'
            vote.movie_id = movie.id
            db_session.add(vote)

        vote.date = datetime.now()
        vote.vote_type = type
       
        db_session.commit()

        return vote
