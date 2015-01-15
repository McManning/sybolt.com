
from datetime import datetime

from sqlalchemy import Column, String, Integer, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship, backref, deferred

from sybolt.models import Base

class MovieNight(Base):
    __tablename__ = 'movie_night'
    __writable__ = ('title', 'trailer_url', 'imdb_url', 'poster_url', 'synopsis')

    id = Column(Integer, primary_key=True)
    date = Column(DateTime)

    title = Column(String)
    trailer_url = Column(String)
    imdb_url = Column(String)
    poster_url = Column(String)
    synopsis = Column(String)

    # this.recommendations = list of Movie, and Movie.movie_night = MovieNight
    recommendations = relationship('MovieRecommendation', backref="movie_night")

    # Person in charge of movie night this night
    sybolt_profile_id = Column(Integer, ForeignKey('sybolt_profile.id'))

    # this.profile = SyboltProfile, and SyboltProfile.movie_night = MovieNight
    profile = relationship('SyboltProfile', backref="movie_night")

    def serialize(self):
        return dict(
            id = self.id,
            date = self.date.strftime('%Y-%m-%d'),
            title = self.title,
            trailer_url = self.trailer_url,
            imdb_url = self.imdb_url,
            poster_url = self.poster_url,
            synopsis = self.synopsis,
            recommendations = [r.serialize() for r in self.recommendations],
            profile = self.profile.serialize()
        )


class MovieRecommendation(Base):
    __tablename__ = 'movie_recommendation'
    __writable__ = ('title', 'poster_url', 'movie_night_id')

    id = Column(Integer, primary_key=True)
    created_time = Column(DateTime, default=datetime.now)
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