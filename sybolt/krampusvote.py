
from datetime import datetime

from flask import Blueprint, render_template, request, jsonify
from sqlalchemy import func
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.exc import IntegrityError

from .database import db_session
from .models import Movie, KrampusVote

group = Blueprint('krampusvote', __name__, url_prefix='/krampusvote')

@group.route('/')
def index():
    return render_template(
        '/krampusvote.html'
    )

@group.route('/status')
def get_status():
    """ Retrieve the active user's current vote status.
    """

    votes_today = KrampusVote.votes_today(request.remote_addr)
    total_votes = KrampusVote.total_votes(request.remote_addr)

    # TODO: Less hardcoding :)
    return jsonify({
        'remoteAddr': request.remote_addr,
        'now': datetime.now(),
        'remainingDaily': 2 - votes_today,
        'totalVotes': total_votes
    })

@group.route('/vote/movie', methods=['POST'])
def vote_movie():
    """ Add a naughty or nice vote to a movie.

    The movie selected must be after 12/25/2014.
    The profile who picked the movie gets the naughty
    or nice vote. If the movie was already voted on by
    this user, then we change their prior vote. 

    This method returns an error response if the vote
    does not fall into the parameters, otherwise it will
    return a 201 CREATED and successful response

    POST 
        type=naughty
        id=10
    """

    if 'id' not in request.form or \
        'type' not in request.form:
        
        return jsonify({
            'error': 'Missing parameters in post body'
        }), 400

    try:
        movie = Movie.query\
            .filter(Movie.id == request.form['id'])\
            .filter(Movie.date > '2014-12-26')\
            .one()
    except NoResultFound:
        return jsonify({
            'error': 'Invalid movie selected'
        }), 400
    except:
        return jsonify({
            'error': 'Unknown error yay!'
        }), 400
    else:

        try:
            # Apply our vote
            vote = KrampusVote.vote(
                movie, 
                request.remote_addr, 
                request.form['type']
            )

        except IntegrityError:
            return jsonify({
                'error': 'Invalid post data'
            }), 400
        else:
            return jsonify({
                'date': str(vote.date),
                'id': vote.id,
                'profile': vote.profile,
                'type': vote.vote_type
            }), 201

@group.route('/vote/daily', methods=['POST'])
def vote_daily():
    """ Add a daily naughty or nice vote to a person


    """
    return jsonify({
        'ok': 'cool'
    }), 201
