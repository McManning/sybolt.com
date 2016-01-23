
from django.conf.urls import url
from django.contrib.auth import views as auth_views

from . import views

urlpatterns = [
    url(
        r'^login',
        auth_views.login,
        {'template_name': 'safespace/login.html.j2'},
        name='login'
    ),
    url(
        r'^logout',
        auth_views.logout,
        {'template_name': 'safespace/logout.html.j2'},
        name='logout'
    ),
    url(r'^register', views.register, name='register'),
    url(r'^$', views.index, name='index')
]
