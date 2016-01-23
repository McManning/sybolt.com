# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-01-06 00:22
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('safespace', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='minecraft_username',
            field=models.CharField(blank=True, max_length=16),
        ),
        migrations.AlterField(
            model_name='profile',
            name='minecraft_uuid',
            field=models.CharField(blank=True, max_length=36),
        ),
        migrations.AlterField(
            model_name='profile',
            name='murmur_username',
            field=models.CharField(blank=True, max_length=32),
        ),
    ]
