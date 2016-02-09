
from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),

    # Get a comparison dataset (/ship/leftPerson/with/rightPerson)
    url(r'^ship/(?P<leftPerson>\w+)/with/(?P<rightPerson>\w+)$', views.shipping),
]
