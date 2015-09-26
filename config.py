
class Config(object):
    DEBUG = False
    PORT = 5000
    SQLALCHEMY_DATABASE_URI = 'sqlite:///sybolt.db'

    # Content that is normally served through Nginx
    ASSETS_PATH = '/path/to/static/content'

class TuningForkProd(Config):
    """ sybolt.com configuration (production)
        Nginx will proxy access to the python process,
        along with routing static file access to our dev
        deployment path
    """
    PORT = 5000
    SQLALCHEMY_DATABASE_URI = 'sqlite:////var/local/sybolt/prod.db'
    ASSETS_PATH = '/var/www/prod/sybolt'

class TuningForkDev(Config):
    """ dev.sybolt.com configuration.
        Nginx will proxy access to the python process,
        along with routing static file access to our dev
        deployment path
    """
    DEBUG = True
    PORT = 5001
    ASSETS_PATH = '/var/www/dev/sybolt'
    SQLALCHEMY_DATABASE_URI = 'sqlite:////var/local/sybolt/dev.db'

class LocalDev(Config):
    DEBUG = True
    ASSETS_PATH = 'X:\Workspace\Xampp\htdocs\sybolt-src'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///sybolt.db'
    