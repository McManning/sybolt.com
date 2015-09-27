# Import flask dependencies
import os
import glob
import json
import datetime
from sybolt import app
from flask import Blueprint, render_template, send_from_directory

from sybolt.database import db_session
from sybolt.models import Movie

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

# Define the main site blueprint
site = Blueprint('site', __name__, url_prefix='')
root = os.path.join(os.path.dirname(os.path.abspath(__file__)))

# If we're running a debug mode, there may be a chance this is running
# without Nginx routing. In that case, add some hacky routing for static resources
if app.config['DEBUG']:
    @site.route('/<regex("css|js|img|font"):ftype>/<path:file>')
    def serve_static(ftype, file):
        return send_from_directory(
            app.config['ASSETS_PATH'] + '\\' + ftype, 
            file
        )

@site.route('/favicon.ico')
def favicon():
    return send_from_directory(
        app.config['ASSETS_PATH'], 
        'favicon.ico'
    )

# Actual routes
@site.route('/')
def landing():

    # Grab the latest movie played
    latest_movie = Movie.query.order_by(Movie.date.desc()).first()

    # Grab the movie data
    movie_data = load_movie_data(latest_movie.tmdb_id)

    return render_template(
        'landing.html',
        latest_movie = movie_data
    )

@site.route('/live')
def live():
    return render_template(
        'live.html'
    )

def load_movie_data(id):
    movie = {}
    cache_path = app.config['TMDB_CACHE_PATH']

    try:
        with open('{}/{}.json'.format(cache_path, id)) as f:
            movie = json.loads(f.read())

    except FileNotFoundError:
        # If the movie isn't cached, try to load from TMDB
        try:
            from sybolt.tmdb_api import cache_movie
            movie = cache_movie(
                app.config['TMDB_API_KEY'], 
                cache_path, 
                id
            )
        except:
            movie = None

    # TODO: Handling additional errors
    return movie

@site.route('/live/schedule/<int:month>/<int:year>')
def schedule_page(month, year):
    # grab movie entries for the month
    # load the cached json, or download if we don't have one
    # merge with instance data (profile, date, etc)
    # render partial template

    search_month = datetime.date(int(year), int(month), 1)
    if int(month) < 12:
        next_month = datetime.date(int(year), int(month) + 1, 1)
    else:
        next_month = datetime.date(int(year) + 1, 1, 1)

    # Pull up all movies in our database within the specified month
    movies = Movie.query\
        .filter(Movie.date.between(search_month, next_month))\
        .order_by(Movie.date)\
        .all()

    entries = []
    for movie in movies:
        entry = load_movie_data(movie.tmdb_id)
        entry['profile'] = movie.profile
        entry['date'] = '{} {}'.format(movie.date.strftime('%B')[:3].upper(), movie.date.day)
        entries.append(entry)

    return render_template(
        'schedule-page.html',
        movies=entries
    )


