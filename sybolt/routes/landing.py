
import os
from sybolt import app
from flask import Blueprint, render_template, send_from_directory

from sybolt.database import db_session
from sybolt.models import Movie
#from sybolt.services import MurmurServiceNotifier

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

# Define the main site blueprint
group = Blueprint('landing', __name__, url_prefix='')
root = os.path.join(os.path.dirname(os.path.abspath(__file__)))

# If we're running a debug mode, there may be a chance this is running
# without Nginx routing. In that case, add some hacky 
# routing for static resources
if app.config['DEBUG']:
    @group.route('/<regex("css|js|img|font"):ftype>/<path:file>')
    def serve_static(ftype, file):
        return send_from_directory(
            app.config['ASSETS_PATH'] + '\\' + ftype, 
            file
        )

@group.route('/favicon.ico')
def favicon():
    return send_from_directory(
        app.config['ASSETS_PATH'], 
        'favicon.ico'
    )

# Actual routes
@group.route('/')
def landing():

    # Grab the latest movie to display on the landing page
    latest_movie = Movie.get_latest()

    return render_template(
        'landing.html',
        latest_movie = latest_movie
    )
