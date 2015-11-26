
import os
import logging

class Config(object):

    # Application version, used for cachebusting resources
    VERSION = '1.0.0'

    DEBUG = False
    PORT = 5000
    USE_MINIFIED_JS = False
    DATABASE_URI = 'sqlite:///sybolt.db'

    # Content that is normally served through Nginx
    ASSETS_PATH = '/path/to/static/content'

    # Cache path for TMDB API responses
    TMDB_CACHE_PATH = '/path/to/tmdb/cache'

    # PKey for The Movie Database (stored on env)
    TMDB_API_KEY = os.environ['TMDB_API_KEY']

    # Logging settings
    LOG_FILE = '/path/to/file.log'
    LOG_LEVEL = logging.DEBUG

    # Murmur communication settings
    #MURMUR_HOST = '127.0.0.1'
    #MURMUR_PORT = 6502
    #MURMUR_SECRET = os.environ['MURMUR_SECRET']

    RTMP_CONNECTION_URI = 'rtmp://sybolt.com:1935/live'
    RTMP_STATUS_URI = 'http://localhost/rtmp_status'

    # Salt used for hashing account passwords (stored on env)
    PASSWORD_SALT = os.environ['PASSWORD_SALT']

    SECRET_KEY = os.environ['FLASK_SECRET_KEY']

    # Flask-Login cookie settings
    REMEMBER_COOKIE_NAME = 'remember_me_fondly'
    REMEMBER_COOKIE_DOMAIN = '.sybolt.com'
    REMEMBER_COOKIE_SECURE = True
    REMEMBER_COOKIE_HTTPONLY = True

class TuningForkProd(Config):
    """ sybolt.com configuration (production)
        Nginx will proxy access to the python process,
        along with routing static file access to our dev
        deployment path
    """
    PORT = 5000
    USE_MINIFIED_JS = True
    DATABASE_URI = 'sqlite:////var/local/sybolt/prod.db'
    ASSETS_PATH = '/var/www/prod/sybolt'
    TMDB_CACHE_PATH = '/var/cache/sybolt/tmdb'
    LOG_FILE = '/var/log/nginx/prod.sybolt.process.log'
    LOG_LEVEL = logging.DEBUG

class TuningForkDev(Config):
    """ dev.sybolt.com configuration.
        Nginx will proxy access to the python process,
        along with routing static file access to our dev
        deployment path
    """
    DEBUG = True
    USE_MINIFIED_JS = False
    PORT = 5001
    DATABASE_URI = 'sqlite:////var/local/sybolt/dev.db'
    ASSETS_PATH = '/var/www/dev/sybolt'
    TMDB_CACHE_PATH = '/var/cache/sybolt/tmdb' # Same as prod (same data)
    LOG_FILE = '/var/log/nginx/dev.sybolt.process.log'
    LOG_LEVEL = logging.DEBUG

class LocalDev(Config):
    DEBUG = True
    USE_MINIFIED_JS = False
    DATABASE_URI = 'sqlite:///sybolt.db'
    ASSETS_PATH = 'X:\\Workspace\\Xampp\\htdocs\\sybolt-src'
    TMDB_CACHE_PATH = 'X:\\Workspace\\Xampp\\htdocs\\sybolt-src\\tmdb_cache'
    LOG_FILE = 'X:\\Workspace\\Xampp\\htdocs\\sybolt-src\\out.log'
    LOG_LEVEL = logging.DEBUG

    RTMP_STATUS_URI = 'https://sybolt.com/rtmp_status'
