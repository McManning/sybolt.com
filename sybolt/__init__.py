
import os
from flask import Flask, render_template
from werkzeug.routing import BaseConverter

#from flask.ext.sqlalchemy import SQLAlchemy
#from sybolt.live.routes import live as live_blueprint

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

#db = SQLAlchemy(app)

# Register blueprint routes
from sybolt.routes import site
app.register_blueprint(site)
#app.register_blueprint(live_blueprint)

from sybolt.database import init_db
init_db()
