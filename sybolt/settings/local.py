# Environment settings specific to local development
import os
from sybolt.settings.shared import *

SECRET_KEY = os.environ['DJANGO_SECRET_KEY']
DEBUG = True

# Database

DATABASE_PATH = os.path.join(BASE_DIR, 'db.sqlite3')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': DATABASE_PATH,
    }
}

# Logging settings

LOG_FILE = os.path.join(BASE_DIR, 'logs/local.log')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '%(asctime)s %(levelname)-8s %(name)-15s %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': LOG_FILE,
            'maxBytes': 1024*1024*5, # 5 MB
            'backupCount': 0,
            'formatter': 'verbose'
        }
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
        },
        'sybolt': {
            'handlers': ['file'],
            'level': 'DEBUG'
        }
    },
}

# TMDB API configurations

TMDB_CACHE_PATH = BASE_DIR + '/tmdb_cache'

# For additional security, this will just exist in the env
TMDB_API_KEY = os.environ['TMDB_API_KEY']

# Live application settings

RTMP_STATUS_URI = 'http://sybolt.com:501/status'
