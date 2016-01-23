from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class Profile(models.Model):
    """Additional attributes associated with our User account (one-to-one) 
        See https://docs.djangoproject.com/en/dev/topics/auth/customizing/#extending-the-existing-user-model
        as to why we use a relationship instead of a new user model (tl;dr: laziness)
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    murmur_username = models.CharField(max_length=32, blank=True)

    minecraft_username = models.CharField(max_length=16, blank=True)

    # Generated via https://api.mojang.com/users/profiles/minecraft/{minecraft_username}
    minecraft_uuid = models.CharField(max_length=36, blank=True)

    def clean(self):
        """Check for errors on model validation 

            Note that this is not automatic at save(), and it must
            be done manually, or done through a ModelForm
            See: https://docs.djangoproject.com/en/1.9/ref/models/instances/#django.db.models.Model.clean
        """
        errors = {}

        # Ensure there's a UUID if we have a username
        if self.minecraft_username and not self.minecraft_uuid:
            errors['minecraft_username'] = ValidationError(
                'A Minecraft UUID must be associated with the username', 
                code='invalid'
            )

        # TODO: Ensure Murmur username is registered

        if len(errors):
            raise ValidationError(errors)

    def minecraft_body_url(self, scale = 4):
        """Returns a URL for our avatar (or a Steve, if minecraft_uuid is invalid) """

        return 'https://crafatar.com/renders/body/{}?overlay&scale={}'.format(
            self.minecraft_uuid or 'steve', 
            scale
        )

    def minecraft_head_url(self, size = 64):
        """Returns a URL for our avatar head (or a Steve, if minecraft_uuid is invalid) """

        return 'https://crafatar.com/avatars/{}?size={}&overlay'.format(
            self.minecraft_uuid or 'steve', 
            size
        )

    def avatar_url(self, size = 64):
        """Returns a URL to our display avatar """

        # For now, just support MC avatars or DOG
        if self.minecraft_uuid:
           return self.minecraft_head_url(size)

        return 'dog.png'

