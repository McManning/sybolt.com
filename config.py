
class Config(object):
    DEBUG = False
    PORT = 5000
    MAX_CONTENT_LENGTH = 700 * 1024 # 700 KB
    SQLALCHEMY_DATABASE_URI = 'sqlite:///sybolt.db'
    ASSETS_PATH = '/path/to/static/content'

class ProductionConfig(Config):
    pass
    
class DevelopmentConfig(Config):
    DEBUG = True
    UPLOAD_FOLDER = 'uploads'
    MAX_CONTENT_LENGTH = 900 * 1024 # 900 KB
    ASSETS_PATH = 'X:\Workspace\Xampp\htdocs\sybolt-src'