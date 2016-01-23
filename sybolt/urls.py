"""sybolt URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^safespace/', include('safespace.urls', namespace='safespace')),
    url(r'^live/', include('live.urls', namespace='live')),
    url(r'', include('landing.urls', namespace='landing')),
]

# Lazily hardcoded static routes for dev. Eventually I'll fix this...
urlpatterns += static('/css', document_root=settings.CSS_ROOT)
urlpatterns += static('/font', document_root=settings.FONT_ROOT)
urlpatterns += static('/js', document_root=settings.JS_ROOT)
urlpatterns += static('/img', document_root=settings.IMG_ROOT)
