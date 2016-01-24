
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_http_methods

from .models import Movie, RtmpStatus

def index(request):
    """Render full front page of the Live app.

        After the front page is rendered, all additional requests
        come in expecting either HTML partials or JSON
    """
    return render(request, 'live/index.html.j2')

def schedule_page(request, month, year):
    """Retrieve an HTML fragment for a page of movie listings """
    movies = Movie.get_all_for_month(month, year)

    return render(request, 
        'live/schedule-page.html.j2',
        context={
            'movies': movies
        }
    )

@require_http_methods(['POST'])
def push_publish(request):
    logger.debug('push_publish: {}'.format(request))
    return ''

@require_http_methods(['POST'])
def push_publish_done(request):
    logger.debug('push_publish_done: {}'.format(request))
    return ''

@require_http_methods(['POST'])
def push_play(request):
    logger.debug('push_play: {}'.format(request))
    return ''

@require_http_methods(['POST'])
def push_play_done(request):
    logger.debug('push_play_done: {}'.format(request))
    return ''

@require_http_methods(['GET'])
def status(request):
    """Retrieve JSON representation of the RTMP status """
    try:
        rtmp_status = RtmpStatus()
        response = rtmp_status.status
    except Exception as e:
        logger.error(str(e))
        response = {
            'error': 'Error communicating with status service'
        }

    return JsonResponse(response)



