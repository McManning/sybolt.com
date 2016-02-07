
import logging

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_http_methods

from .models import Bdsm

logger = logging.getLogger('sybolt.love')

def index(request):
    """Render full front page of the Looove app.

        After the front page is rendered, all additional requests
        come in expecting either HTML partials or JSON
    """
    return render(request, 'love/index.html.j2')

