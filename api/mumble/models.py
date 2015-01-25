
import datetime
import json

from sqlalchemy import Column, String, Integer, Boolean, Date, DateTime, ForeignKey
#from sqlalchemy.orm import relationship, backref, deferred

from sybolt.models import Base

class MumblePost(Base):
    __tablename__ = 'mumble_post'

    id = Column(Integer, primary_key=True)

    nickname = Column(String)
    url = Column(String)
    type = Column(String)
    date = Column(DateTime)
    properties = Column(String)

    def serialize(self):

        # Try to parse the metadata attribute as a JSON string
        #try: 
        if self.properties is not None and len(self.properties) > 0:
            properties = json.loads(self.properties)
        else:
            properties = None
        #except:
        #    properties = None

        return dict(
            id = self.id,
            nickname = self.nickname,
            type = self.type,
            url = self.url,
            date = self.date.isoformat(),
            properties = properties
        )
