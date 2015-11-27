
from datetime import datetime
import requests

from flask import Blueprint, render_template, request, jsonify
from flask.ext.login import current_user, login_required

from sybolt import app

from sybolt.models import Movie, KrampusVote
from sybolt.utilities import parse_rtmp_status

group = Blueprint('live', __name__, url_prefix='/live')

@group.route('/')
def live():
    return render_template(
        'live.html'
    )

@group.route('/schedule/<int:month>/<int:year>')
def schedule_page(month, year):
    """ Retrieve all movies for a given period as an HTML partial """

    movies = Movie.get_all_for_month(month, year)

    # Apply some additional krampusVote data to our movies
    # if we're logged in
    if current_user.is_authenticated:
        KrampusVote.apply_votes_to_movies(
            current_user,
            movies
        )

    return render_template(
        'schedule-page.html',
        movies=movies
    )

@group.route('/push/publish', methods=['POST'])
def push_publish():

    # The message to send to all murmur servers/channels when we go live
    #notification = """<br/><br/><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAUZSURBVFiFtZfbb1RVFMZ/+9za0+nM9DLTdpihpVwKBm2lLTS0YPVBgpqo+KCI/hMaH3z2QXmVRHw3+qhBosbERCOIgNgmhUSgwd6kpZdpO/fbOXOOD20HpntaKITvaWatddb37b3X2mcd4bouAwMDbYpTPI1gEAjxdHEPl98dRf340qVLk6K/v79NcYsjgP8pE69H3BFql7a68kcm11QDQzXRVB1VaNhOAduxyFtpHNfZigC/4hRPa6vbvilURaO+JoTfDGAa3ooxjuuQyi0Ry86TyEbLfEIIAFzXLX9IMKixyZkLIWj0hAl6W1EVbVORilDwmQF8ZoCclWI2PkYqH0MIwclT75FOpTj//bn1j4U2zKopOq2N+6kxfJLPxSVvZcgWkhRdG1OvxTS8KEIFoFqvZUegk4XkFIOvHmbgyFEA5uZmuXrlSjlPJXJDM2kPPIeuVpfZHbfIbHycWGa24nnXGD7C9R1UaTUAvPHWCTr79pX8J0+9z+jt2ywvL5dsyvokilBpa9wvkWcKCe7MD7OUntmw2NZioqm7RNpbysgBdF3n9TdPlPOtTxKp31tawRpyVprx6AgFO1uR+EG4rsNsfIzhG38xPTEr+XsPHiIcjlQW4Kmqw2cGyhPiMh0blSv4IVhITPLzd79SyFtldiEEPb29lQW0+NqlRIupabKF5JbIYaXlbk0MMXTxhuTrOtAtC6hereT1WN/TW0HWSjH575Rkb25uxu+vKxfgq26UAl1cclbqsQUA3L37H7ZdlOx1desE1FbXS0EFK7vV61VCOp8gem9Jsvv8vnIBulolBbk8GTms1EI+V5DshlFVLkBTdCmoSvOU7vHHhWnUEmiRdzeZSJQLEEK6EhBCUK15nkhAoKEJj7dGsscT8XIBtiNvE1SujUeFoZmEt4cleyGfZzEaXSegaEmBAEFvG4ZmPpaASMNeeo4+K9lv3bqJbdvlAjKFRMUkilCI1HdsmbyxNszAi4cJhuT2vj4ycj//2o9kbnHDZA3+JrY3PPPQmaBE7tnG/t0H6H2hU/LFYjGG/r5W+l/KmMrHsB1L6oZIewvH3x7kn+E7XPqlganFmyRzcl/DSiuH6zvo7etl4FgPqioX9o8/nMey7h93SYDrOiwkJgnV7S45wzuaOf7Oi2iaSmffPiI7Q1z4qYXpyRnShcTKQOLYmIaXGt1LINjEwLEednREqITxsTGuXr5cZhNHDveVXnNCCPY09WJoJqHWJl579yU0Xd5227KJzi2zMLOIVbAJhBoItjRgeqql2DUk4kk++/STUv9LO7CyCy5TSzfZGXyeUGtTRXIATddoiQRpiQQ3JHwQmXSWL8+ekcglAQA5K8X08ijKHwq5TI6jrxx6otswOrfE2S8+Z35BHk4qCgCIZ+dxF4s4Q0XmZ5bof7mHbW1NWyK27SLDf17n23PfkM5uPE+I/r6DrqLI1QorM0K4bg+m4aVtT5h9XbvYviu04dEAJGNpxm5PcfG3C4xOjeC48qt4DY7jIA71dicMXa/8tbEKvxkk4N2Oqdei6Rqh1iBevwePtwajSieTzpFJZonOLTE+cYe55AR5K7NZSgAKlpXUbNvOCSG8urbxquLZBeLZBXS1Cm91I3PLk2iqUfo0s4oFslaSVG550xU/CNu2sW07p4HyQT6f/9qyLDY6ijXkyJPMVL6ytwLHcXAcB01VPhKu69Ld3XVSuJxxHCcAPNkA8HC4iiKWFCE+vDY88tX/KIX248eASs0AAAAASUVORK5CYII="/> <b> <span style="color:#3c3937; font-size:28px;"> Sybolt Live</span></b><span style="color:#3c3937; font-size:22px"> is now streaming!</span><p style="color:#3c3937; font-size:18px">Check it out at <a href="http://sybolt.com/live">http://sybolt.com/live</a></p>"""

    # notifier = MurmurServiceNotifier(
    #     app.config['MURMUR_HOST'], 
    #     app.config['MURMUR_PORT'],
    #     app.config['MURMUR_SECRET']
    # )
    # notifier.notify_servers('PUSH_PUBLISH {}'.format(str(request.form)))
    # notifier.disconnect()

    # # TODO: Notify murmur servers
    # app.logger.debug('push publish: %s', str(request.form))

    # No content needs to be returned
    return ''

@group.route('/push/publish_done', methods=['POST'])
def push_publish_done():
    # notifier = MurmurServiceNotifier(
    #     app.config['MURMUR_HOST'], 
    #     app.config['MURMUR_PORT'],
    #     app.config['MURMUR_SECRET']
    # )
    # notifier.notify_servers('PUSH_PUBLISH_DONE {}'.format(str(request.form)))
    # notifier.disconnect()

    app.logger.debug('push publish_done: %s', str(request.form))
    return ''

@group.route('/push/play', methods=['POST'])
def push_play():
    # notifier = MurmurServiceNotifier(
    #     app.config['MURMUR_HOST'], 
    #     app.config['MURMUR_PORT'],
    #     app.config['MURMUR_SECRET']
    # )
    # notifier.notify_servers('PLAY {}'.format(str(request.form)))
    # notifier.disconnect()

    app.logger.debug('push play: %s', str(request.form))
    return ''

@group.route('/push/play_done', methods=['POST'])
def push_play_done():
    # notifier = MurmurServiceNotifier(
    #     app.config['MURMUR_HOST'], 
    #     app.config['MURMUR_PORT'],
    #     app.config['MURMUR_SECRET']
    # )
    # notifier.notify_servers('PLAY_DONE {}'.format(str(request.form)))
    # notifier.disconnect()

    app.logger.debug('push play_done: %s', str(request.form))
    return ''

@group.route('/status')
def get_status():
    """ Retrieve JSON representation of RTMP status
    """
    http_response = requests.get(app.config['RTMP_STATUS_URI']).content
    
    json = parse_rtmp_status(http_response)

    # Append some additional information
    json['rtmp_url'] = app.config['RTMP_CONNECTION_URI']

    # TODO: Try to resolve connected clients to logged in users
    return jsonify(json)
