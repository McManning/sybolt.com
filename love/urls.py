
from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),

    # Get a comparison dataset (/leftPerson/x/rightPerson)
    url(r'^(?P<leftPerson>\w+)/x/(?P<rightPerson>\w+)$', views.shipping),
]
