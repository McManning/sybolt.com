
import datetime

from sqlalchemy import Column, String, Integer, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship, backref, deferred

from sybolt.models import Base

class MovieNight(Base):
    __tablename__ = 'movie_night'
    __writable__ = ('title', 'synopsis', 'trailer', 'imdb', 'poster')

    id = Column(Integer, primary_key=True)
    date = Column(Date)

    title = Column(String)
    synopsis = Column(String)
    trailer = Column(String)
    imdb = Column(String)
    poster = Column(String)

    # this.recommendations = list of Movie, and Movie.movie_night = MovieNight
    #recommendations = relationship('MovieRecommendation', backref="movie_night")

    # Person in charge of movie night this night
    #sybolt_profile_id = Column(Integer, ForeignKey('sybolt_profile.id'))

    # this.profile = SyboltProfile, and SyboltProfile.movie_night = MovieNight
    #profile = relationship('SyboltProfile', backref="movie_night")

    # Temporarily made a flat string to be independent from sybolt_profiles
    # at least until we start using them
    profile = Column(String)

    real_profile = None

    def serialize(self):
        return dict(
            id = self.id,
            date = self.date.strftime('%Y-%m-%d'),
            date_fmt = '%s %i' % (self.date.strftime('%B')[:3].upper(), self.date.day), # Formatted as FEB 3, MAR 14, etc
            title = self.title or None,
            synopsis = self.synopsis or None,
            trailer = self.trailer or None,
            imdb = self.imdb or None,
            poster = self.poster or None,
            # If we loaded a SyboltProfile (or other) into real_profile, use that. Otherwise, just use whatever is in profile
            profile = self.real_profile if self.real_profile else self.profile or None
            #recommendations = [r.serialize() for r in self.recommendations],
            #profile = self.profile.serialize()
        )

"""
class MovieRecommendation(Base):
    __tablename__ = 'movie_recommendation'
    __writable__ = ('title', 'poster_url', 'movie_night_id')

    id = Column(Integer, primary_key=True)
    created_time = Column(DateTime, default=datetime.datetime.now)
    title = Column(String)
    poster_url = Column(String)

    movie_night_id = Column(Integer, ForeignKey('movie_night.id'))

    # Person that suggested this movie
    sybolt_profile_id = Column(Integer, ForeignKey('sybolt_profile.id'))

    # this.profile = SyboltProfile, and SyboltProfile.movies = list of Movie 
    profile = relationship('SyboltProfile', backref="movie_recommendations")
    
    def serialize(self):
        return dict(
            id = self.id,
            created_time = self.created_time.isoformat(),
            title = self.title,
            poster_url = self.poster_url,
            movie_night_id = self.movie_night_id,
            profile = self.profile.serialize()
        )
"""