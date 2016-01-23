from django.db import models

class Configurables(models.Model):
    """ Configurable components of the landing page """
    hero_url = models.CharField('Video to be embedded in the Hero', max_length=64)
    last_racist_remark = models.DateTimeField()
