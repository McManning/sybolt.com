
import os
import glob
from datetime import datetime

from sybolt import app
from flask.ext.login import current_user, login_user, logout_user, login_required

from flask import Blueprint, render_template, request, jsonify, flash

from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.exc import IntegrityError

from sybolt.database import db_session
from sybolt.models import Profile, LoginRecord

group = Blueprint('safespace', __name__, url_prefix='/safespace')

@group.route('/')
@login_required
def safe_space():
    return render_template(
        'safespace.html'
    )

@group.route('/login', methods=['GET'])
def login():
    return render_template(
        'safespace/login.html'
    )

@group.route('/login', methods=['POST'])
def post_login():
    email = request.form.get('email', None)
    password = request.form.get('password', None)

    if not email or not password:
        return jsonify({
            'error': 'You must enter an email and password'
        }), 400

    try:
        app.logger.debug(Profile.crypt(password))
        profile = Profile.query\
            .filter(Profile.email == email)\
            .filter(Profile._password == Profile.crypt(password))\
            .one()

        # Record login attempt
        record = LoginRecord()
        record.profile = profile
        record.date = datetime.now()
        record.ip = request.remote_addr
        db_session.add(record)
        db_session.commit()
        
    except (IntegrityError, NoResultFound):
        return jsonify({
            'error': 'Username or password is incorrect'
        }), 400
    else:
        # Push to Flask-Login
        login_user(profile, remember=True)
        flash('Logged in successfully')
        
        return jsonify({
            'id': profile.id
        }), 200


@group.route('/register', methods=['GET'])
def get_register():
    return render_template(
        'safespace/register.html'
    )

@group.route('/register', methods=['POST'])
def post_register():
    """ API POST new registration """

    # Ensure they know the secret before registering
    # if request.form['secret'] != app.config['REGISTRATION_SECRET']:
    #     return jsonify({
    #             'error': 'Invalid secret'
    #     }), 400

    app.logger.debug(request.form)

    profile = Profile()
    profile.email = request.form['email']
    profile.password = request.form['password']
    profile.nickname = request.form['nickname']
    profile.minecraft_uuid = request.form['minecraftUUID']
    profile.minecraft_username = request.form['minecraftUsername']
    profile.murmur_username = request.form['murmurUsername']

    if not profile.email or not profile.password or not profile.nickname\
        or not profile.minecraft_uuid or not profile.minecraft_username\
        or not profile.murmur_username:
        return jsonify({
            'error': 'You must fill out all fields'
        }), 400

    if profile.password.find('potato') > -1:
        return jsonify({
            'error': 'Shut up Trevor'
        }), 400

    if len(profile.password) < 6:
        return jsonify({
            'error': 'Your password is not secure enough'
        }), 400

    if request.form['password'] != request.form['passwordConfirm']:
        return jsonify({
            'error': 'Passwords do not match'
        }), 400

    # TODO: Better security... but.. meh. Closed system.

    db_session.add(profile)
    db_session.commit()

    return jsonify({
        'id': profile.id,
        'email': profile.email,
    }), 201

@group.route('/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    # TODO: Render logout screen
    return render_template(
        'safespace/logout.html'
    )
