
import os
from logging import FileHandler, Formatter
from flask import Flask, render_template
from werkzeug.routing import BaseConverter

app = Flask(__name__, static_url_path='')

# Adding support for Regex in Flask
# Via: http://stackoverflow.com/questions/5870188/does-flask-support-regular-expressions-in-its-url-routing
# Example usage: @app.route('/<regex("[abcABC0-9]{4,6}"):uid>-<slug>/')
class RegexConverter(BaseConverter):
    def __init__(self, url_map, *items):
        super(RegexConverter, self).__init__(url_map)
        self.regex = items[0]

app.url_map.converters['regex'] = RegexConverter

# TODO: Temp way of specifying environment. Clean this up!
if 'SYBOLT_ENV' not in os.environ:
    raise Exception('You must specify SYBOLT_ENV')

app.config.from_object('config.' + os.environ['SYBOLT_ENV'])

# Set up logging
handler = FileHandler(app.config['LOG_FILE'])
handler.setLevel(app.config['LOG_LEVEL'])
handler.setFormatter(Formatter(
    '%(asctime)s %(levelname)s: %(message)s '
    '[in %(pathname)s:%(lineno)d]'
))
app.logger.addHandler(handler)

# Register blueprint routes
from .routes.landing import group as landing
from .routes.krampusvote import group as krampusvote
from .routes.murmur import group as murmur
from .routes.safespace import group as safespace
from .routes.live import group as live

app.register_blueprint(landing)
app.register_blueprint(krampusvote)
app.register_blueprint(murmur)
app.register_blueprint(safespace)
app.register_blueprint(live)

from .database import init_db
init_db()
