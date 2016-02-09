
import logging

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_http_methods

from .models import Bdsm, BdsmCategory

logger = logging.getLogger('sybolt.love')

def index(request):
    """ Render full front page of the Looove app.

        After the front page is rendered, all additional requests
        come in expecting either HTML partials or JSON
    """
    return render(request, 'love/index.html.j2')


def shipping(request, leftPerson, rightPerson):
    """ Render a shipping between two people:
        
        /ship/leftPerson/with/rightPerson
    """

    left = Bdsm.objects.filter(user=leftPerson).order_by('-percent')
    right = Bdsm.objects.filter(user=rightPerson).order_by('-percent')

    # Shuffle data a bit 
    left_categories = {x.category: x.percent for x in left}
    right_categories = {x.category: x.percent for x in right}

    comparative = BdsmCategory.get_comparative_categories(leftPerson, rightPerson)

    comparative_json = []
    for c in comparative:
        if c['left_category'] == c['right_category']:
            category = c['left_category']
        else:
            category = c['left_category'] + ' <br> ' + c['right_category']

        # Calculate a weighted average of values
        lp = c['left_percent']
        rp = c['right_percent']
        avg_p = (lp+rp)/2
        min_p = min(lp, rp)
        weighted_avg = int(round(avg_p-(avg_p-min_p)*(1-min_p/100)))

        comparative_json.append([category, lp, rp, weighted_avg])

    response = {
        'individuals': [
            {
                'name': left[0].user,
                'categories': [[x.category, x.percent] for x in left]
            },
            {
                'name': right[0].user,
                'categories': [[x.category, x.percent] for x in right]
            }
        ],
        'comparative': comparative_json
    }

    return JsonResponse(response)
