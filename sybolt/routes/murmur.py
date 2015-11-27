
import sqlite3
import base64
from datetime import datetime

from flask import Blueprint, request, jsonify

from sybolt import app

group = Blueprint('murmur', __name__, url_prefix='/murmur')

@group.route('/search', methods=['POST'])
def post_search():
    """ Search for a username """

    search_username = request.form['username']

    # We don't have SQLAlchemy tied to the murmur
    # database, so let's connect directly for now
    conn = sqlite3.connect(app.config['MURMUR_SQLITE'])
    c = conn.cursor()

    c.execute('''
        SELECT user_id, name, texture, last_active
        FROM users 
        WHERE name=? COLLATE NOCASE
        ''', 
        (search_username,)
    )

    result = c.fetchone()
    if not result:
        return jsonify({
            'error': 'Username not found'
        }), 404

    user_id, name, texture, last_active = result

    return jsonify({
        'id': user_id,
        'username': name,
        'lastActive': last_active,
        #'texture': base64.b64encode(texture)\
        #    .decode('utf-8') if texture else None
    })
