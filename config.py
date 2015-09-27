
import os

class Config(object):
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

class LocalDev(Config):
    DEBUG = True
    USE_MINIFIED_JS = False
    DATABASE_URI = 'sqlite:///sybolt.db'
    ASSETS_PATH = 'X:\\Workspace\\Xampp\\htdocs\\sybolt-src'
    TMDB_CACHE_PATH = 'X:\\Workspace\\Xampp\\htdocs\\sybolt-src\\tmdb_cache'
