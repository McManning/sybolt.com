from django.contrib import admin

from .models import Movie

class MovieAdmin(admin.ModelAdmin):
    list_display = ('date', '__str__')

admin.site.register(Movie, MovieAdmin)
