import json

from django.db import models
from django.conf import settings

class Bdsm(models.Model):
    """BDSM test record for mapping members to kinks """

    user = models.CharField('User', max_length=80)
    category = models.CharField('Kink Category', max_length=20)
    percent = models.IntegerField('Percentage match')

    # @classmethod
    # def get_latest(cls):
    #     """Retrieve the latest movie played """
    #     return cls.objects.order_by('-date')[0]

    # @classmethod
    # def get_all_for_month(cls, month, year):
    #     """Retrieve movies that have been played within a given month """
    #     return cls.objects.filter(date__year=year, date__month=month)

    def __str__(self):
        """Render out a description of this record 
            
            Used by Django admin to display editable records
        """
        return '"{user}" {percent} - {category}'.format(
            user=self.user,
            percent=self.percent,
            category=self.category
        )

class BdsmCategory(models.Model):
    """Extra data associated with BDSM categories """

    category = models.CharField('Kink Category', max_length=20)
    related = models.CharField('Inversely related kink', max_length=20)
    description = models.CharField('Kink Description', max_length=500)

    