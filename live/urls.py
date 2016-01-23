
from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),

    # Push notifications from Nginx's RTMP module
    url(r'^push/publish', views.push_publish),
    url(r'^push/publish_done', views.push_publish_done),
    url(r'^push/play', views.push_play),
    url(r'^push/play_done', views.push_play_done),

    # RTMP status check
    url(r'^status', views.status),
    
    # Schedule page partial (/schedule/month/year)
    url(r'^schedule/(?P<month>[0-9]{1,2})/(?P<year>[0-9]{4})$', views.schedule_page)
]
