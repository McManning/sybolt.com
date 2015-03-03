
import datetime

from sqlalchemy import Column, String, Integer, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship, backref, deferred

from sqlalchemy import event # For event.listens_for decorator

from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class SyboltProfile(Base):
    __tablename__ = 'sybolt_profile'
    
    id = Column(Integer, primary_key=True)
    username = Column(String)
    password = Column(String)
    email = Column(String)

    public_email = Column(Boolean, default=False)
    allow_newsletter = Column(Boolean, default=True)
    
    # References to other profiles we're tracking for this user
    """
    minecraft_profile_id = Column(Integer, ForeignKey('minecraft_profile.id'))
    murmur_profile_id = Column(Integer, ForeignKey('murmur_profile.id'))
    
    minecraft_profile = relationship(
        'MinecraftProfile', 
        uselist=False, 
        backref='sybolt_profile'
    )
    
    """
    
    mumble_identities = relationship(
        'MumbleIdentity',
        backref='sybolt_profile'
    )

    created_time = Column(DateTime, default=datetime.datetime.now)
    
    last_login_time = Column(DateTime, default=datetime.datetime.now)
    last_login_ip = Column(String)

    def get_avatar(self):
        """
            Retrieve the avatar associated with this profile.
            This will look in the following places, in order:
                1. self.avatar_url if it exists
                2. Gravatar url if self.email is associated with a Gravatar
                2. minecraft_profile.avatar_url if it exists
                3. murmur_profile.avatar_url if it exists
                4. Return some default url
        """
        
        # Gravatar uses the following scheme:
        # http://www.gravatar.com/avatar/b5c1e2e51ba2f86f02bddb5921cb0ced?s=64&d=404
        # where the numbers are a md5(lowercase(email)) s=64 is dimensions and d=404 
        # forces a 404 response if the user does not have an avatar on Gravatar

        return '/img/minecraft/heads/head-64_noligorithm.png'


    def serialize(self, only_public_data = False):
        """
        Serialize properties of this profile into a dict(). 
        If only_public_data is true, this will only serialize basic information about the profile
        (minimum info). If false, it will return everything (including private stuff).
        TODO: Better way of dealing with permissions for this type of query.
        """

        # Collect basic information
        public_data = dict(
            id = self.id,
            username = self.username,
            public_email = self.public_email,
            created_time = self.created_time.isoformat(),
            last_login_time = self.last_login_time.isoformat(),
            avatar_url = self.get_avatar()
        )

        # If they have a public email, or want full data, add that as well
        if self.public_email or not only_public_data:
            public_data['email'] = self.email

        if not only_public_data: # Add extended private data as well, if requested

            if self.mumble_identities:
                mumble_identities = [x.serialize() for x in self.mumble_identities]
            else:
                mumble_identities = None

            private_data = dict(
                allow_newsletter = self.allow_newsletter,
                last_login_ip = self.last_login_ip,
                mumble_identities = mumble_identities
            )

            # Merge the private data into the public as well if requested
            public_data.update(private_data)

        return public_data
