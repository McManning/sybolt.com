
from django.shortcuts import render
from django.http import HttpResponse

from live.models import Movie

def index(request):
    
    return render(request, 
        'landing/index.html.j2',
        context={
            'latest_movie': Movie.get_latest_played()
        }
    )


