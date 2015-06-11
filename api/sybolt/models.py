
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

    created_time = Column(DateTime, default=datetime.datetime.now)
    
    last_login_time = Column(DateTime, default=datetime.datetime.now)
    last_login_ip = Column(String)

    # Linked Minecraft identity
    minecraft_verification = Column(String)
    minecraft_username = Column(String)

    # Linked Steam account
    steam_id = Column(String) # TODO: Fix datatype?
    
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

        # TODO! Stuff!
        if self.minecraft_username:
            return '/img/minecraft/heads/head-64_{}.png'.format(self.minecraft_username)

        return '/img/default-profile-icon.png'


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
            created_time = self.created_time.isoformat() if self.created_time else None,
            last_login_time = self.last_login_time.isoformat() if self.last_login_time else None,
            avatar_url = self.get_avatar(),
            minecraft_username = self.minecraft_username
        )

        # If they have a public email, or want full data, add that as well
        if self.public_email or not only_public_data:
            public_data['email'] = self.email

        if not only_public_data: # Add extended private data as well, if requested

            private_data = dict(
                allow_newsletter = self.allow_newsletter,
                last_login_ip = self.last_login_ip,
                steam_id = self.steam_id,
                minecraft_verification = self.minecraft_verification
            )

            # Merge the private data into the public as well if requested
            public_data.update(private_data)

        return public_data
