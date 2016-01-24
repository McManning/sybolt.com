
import os

# TODO:  This dirname chain is dumb.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

MEDIA_ROOT = BASE_DIR + '/media/'
STATIC_ROOT = BASE_DIR + '/static/'

# We use different static directories because I compile 
# frontend code via grunt (sass compiling, minifying, etc),
# and most resources are shared among django apps, but django
# wants to use silly collectstatic stuff to merge it all together
# for deployment. That's fine and all, but I don't want to commit
# unnecessary copies of things. EVENTUALLY, I'll come up with a 
# better deployment setup, something that doesn't involve duplicating
# resources and works with django without having to collectstatic
# each deployment run. 
CSS_ROOT = BASE_DIR + '/css'
FONT_ROOT = BASE_DIR + '/font'
JS_ROOT = BASE_DIR + '/js'
IMG_ROOT = BASE_DIR + '/img'

# Site version number, used for cache busting among other things
VERSION = '1.0.0'

ALLOWED_HOSTS = []

# Application definition

INSTALLED_APPS = [
    'landing.apps.LandingConfig',
    'safespace.apps.SafespaceConfig',
    'live.apps.LiveConfig',
    'django_jinja',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE_CLASSES = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'sybolt.urls'

TEMPLATES = [
    {
        "BACKEND": "django_jinja.backend.Jinja2",
        'DIRS': [BASE_DIR + '/sybolt/templates'],
        "APP_DIRS": True,
        "OPTIONS": {
            "match_extension": ".j2",
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
            'globals': {
                'settings': 'django.conf.settings'
            }
        }
    },
    # Django templates - for admin pages and non jinja2 stuff
    # These are accessed via `templates` directory under each app
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    }
]

WSGI_APPLICATION = 'sybolt.wsgi.application'


# Password validation
# https://docs.djangoproject.com/en/1.9/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    # {
    #     'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    # },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    # },
]


# Internationalization
# https://docs.djangoproject.com/en/1.9/topics/i18n/

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'America/New_York' # UTC
USE_I18N = True
USE_L10N = True
USE_TZ = True


# Static serve settings, required by admin module
STATIC_URL = '/static/'


# Auth settings

LOGIN_REDIRECT_URL = '/safespace'


# TMDB API settings

TMDB_API_URI = 'http://api.themoviedb.org/3/movie'
