
import os
from logging import FileHandler, Formatter
from flask import Flask
from flask.ext.login import LoginManager
from werkzeug.routing import BaseConverter

app = Flask(__name__, static_url_path='')
app.config.from_object('config.' + os.environ['SYBOLT_ENV'])

from .database import init_db
from .models import Profile

init_db()

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

# Set up logging
handler = FileHandler(app.config['LOG_FILE'])
handler.setLevel(app.config['LOG_LEVEL'])
handler.setFormatter(Formatter(
    '%(asctime)s %(levelname)s: %(message)s '
    '[in %(pathname)s:%(lineno)d]'
))
app.logger.addHandler(handler)

# Flask-login stuff
login_manager = LoginManager()
login_manager.init_app(app)

# Customize view routes. If they aren't logged in
# and access a @login_required route, they are redirected
# to this view with a notice set (to flask.flash)
login_manager.login_view = '/safespace/login'

@login_manager.user_loader
def load_profile(profile_id):
    return Profile.query\
        .filter(Profile.id == profile_id)\
        .one()

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
