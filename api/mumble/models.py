
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

class MumbleIdentity(Base):
    __tablename__ = 'mumble_identity'
    
    id = Column(Integer, primary_key=True)
    sybolt_profile_id = Column(Integer, ForeignKey('sybolt_profile.id'))

    nickname = Column(String)
    password = Column(String)
    #channel = Column(String)
    
    created_time = Column(DateTime, default=datetime.datetime.now)
    
    last_login_time = Column(DateTime, default=datetime.datetime.now)
    last_login_ip = Column(String)

    def get_avatar(self):
        return '/img/default-profile-icon.png'

    def serialize(self):
        return dict(
            id = self.id,
            nickname = self.nickname,
            password = self.password,
            channel = None, # TODO: However this'll work.
            created_time = self.created_time.isoformat(),
            last_login_time = self.last_login_time.isoformat(),
            last_login_ip = self.last_login_ip,
            avatar_url = self.get_avatar()
        )
