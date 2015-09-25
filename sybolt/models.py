
from sqlalchemy import Column, Integer, String, Date
from sybolt.database import Base

class Movie(Base):
    __tablename__ = 'movie'
    id = Column(Integer, primary_key=True)
    tmdb_id = Column(Integer)
    profile = Column(String(80))
    date = Column(Date)

    def __init__(self, tmdb_id, profile, date):
        self.tmdb_id = tmdb_id
        self.profile = profile
        self.date = date
