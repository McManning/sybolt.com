
import sybolt.web

from sybolt.models import SyboltProfile

# Import for status codes
# see: http://python.readthedocs.org/en/latest/library/http.client.html#http.client.responses
import http.client

import tornado.auth # For OpenIdMixin
from tornado.log import access_log, app_log, gen_log
from sqlalchemy import func

class ProfileHandler(sybolt.web.RestRequestHandler):

    @sybolt.web.require_auth
    def get(self, uid = None):
        """
            GET /api/profile - Retrieve our own profile, if logged in
            GET /api/profile/id/10 - Retrieve another user's profile
            POST /api/profile - Create a new profile
        """

        self.write_json(self.current_user.serialize())

    def _validate_new_user(self, username, password):
        """
        Validate the passed in username and password to ensure
        it's a user we can actually create. This performs character
        validation of both fields, min length checks, existing user
        checks, etc.

        Will return None if there are no errors, otherwise an error string.
        """
        if not username or not password:
            return 'You must specify a username and password.'

        # TODO: Length checks, character checks


        # Check if the username exists already
        query = self.application.db.query(SyboltProfile)\
            .filter(SyboltProfile.username == username)

        if query.count() > 0:
            return 'That username already exists.'

        # If all errors passed, we're good!
        return None

    def post(self):
        """
        POST /api/profile
        Create a new profile
        """
        username = self.get_argument('username', None)
        password = self.get_argument('password', None)
        invitation_code = self.get_argument('invite', None)

        if invitation_code != 'fuckyougfro':
            validation_error = 'Sorry, looks like you didn\'t get the invite :('
        else:
            validation_error = self._validate_new_user(username, password)

        if validation_error == None:

            # Add our new user!
            profile = SyboltProfile()

            # Bare minimum, we need a username/password combination. 
            # The rest, we have SQLAlchemy defaults for.
            profile.username = username
            profile.password = password

            self.application.db.add(profile)

            try:
                self.application.db.commit()
            except:
                self.application.db.rollback()
                # TODO: Do something!!!! Error response and such

            # Log them in as well
            self.set_current_user(profile)

            # Respond with their new profile
            json = profile.serialize()

        else:
            # Respond with the validation error (400)
            json = dict(
                error=http.client.BAD_REQUEST,
                message=validation_error
            )

            self.set_status(http.client.BAD_REQUEST)

        self.write_json(json)

    @sybolt.web.require_auth
    def put(self):
        """
        PUT /api/profile
        Update our current profile. This only applies to writable properties.
        """
        profile = self.current_user

        # TODO: Validate fields against rules

        password = self.get_argument("password", profile.password)
        if len(password) > 7:
            profile.password = password

        profile.email = self.get_argument("email", profile.email)

        # TODO: Less fucking hack between JSON up and parsing.
        public_email = self.get_argument("public_email", None)
        if public_email is not None:
            profile.public_email = (public_email == 'true')

        allow_newsletter = self.get_argument("allow_newsletter", None)
        if allow_newsletter is not None:
            profile.allow_newsletter = (allow_newsletter == 'true')

        try:
            self.application.db.commit()
        except:
            self.application.db.rollback()
            raise tornado.web.HTTPError(http.client.BAD_REQUEST)

        json = profile.serialize()

        self.write_json(json)

class AuthHandler(sybolt.web.RestRequestHandler):

    def check_auth(self, username, password):
        """
        Compare authentication against known Sybolt profiles.
        If it's valid credentials, return the profile. 
        """
        access_log.info("Login attempt by '%s':'%s'", username, password)

        profile = self.application.db.query(SyboltProfile)\
            .filter(func.lower(SyboltProfile.username) == func.lower(username))\
            .filter(SyboltProfile.password == password)\
            .first()

        return profile

    @sybolt.web.require_auth
    def get(self):
        """
        GET /api/authenticate

        Retrieve our current profile. If we are not logged in, this will return 403.
        """

        self.write_json(self.current_user.serialize())

    def post(self):
        """
        POST /api/profile/auth
        Login with provided credentials and cache our login information.
        Responds with our profile data (same as /api/profile). 
        Upon error, this will respond with 401 Unauthorized and error message.

        http://stackoverflow.com/questions/3297048/403-forbidden-vs-401-unauthorized-http-responses
        See 401 vs 403 argument. Not sure if 401 fits the use case of RESTful services.
        """

        username = self.get_argument("username", "")
        password = self.get_argument("password", "")

        profile = self.check_auth(username, password)

        # Check login
        if profile:
            self.set_current_user(profile)

            # Update our login details
            profile.last_login_ip = self.request.remote_ip
            self.application.db.commit()

            # Respond with the json and a 200 OK 
            json = profile.serialize()

        else:
            # Clear logged in user
            self.set_current_user(None)

            # Provide an invalid credentials response
            json = dict(
                error=http.client.UNAUTHORIZED,
                message="Invalid login. Either the username or password is incorrect."
            )

            self.set_status(http.client.UNAUTHORIZED)

        self.write_json(json)

    @sybolt.web.require_auth
    def delete(self):
        """
        DELETE /api/profile/auth
        Logout. Essentially. Will delete our cached credentials and respond
        with either a success (200) or error (403) message.
        """
        self.clear_cookie("user")

        self.write_json(dict(
            message="You are now logged out."
        ))


class NotFoundHandler(sybolt.web.RestRequestHandler):
    def get(self, path):
        json = dict(
            error=http.client.NOT_FOUND,
            message="Page Not Found (%s)" % path
        )

        self.set_status(http.client.NOT_FOUND)
        self.write_json(json)
        

class SteamOpenIdMixin(tornado.auth.OpenIdMixin):
    """Steam OpenID authentication.

    Mixin to authenticate through the steam community
    Example usage::

        class SteamAuthHandler(tornado.web.RequestHandler, SteamOpenIdMixin):
        @tornado.gen.coroutine
        def get(self):
            if self.get_argument("openid.mode", None):
                # Authentication redirect back to us with user data            
                user = yield self.get_authenticated_user()

                if not user:
                    raise tornado.web.HTTPError(500, "Steam auth failed")
                # Save the user with, e.g., set_secure_cookie()
            else:
                yield self.authenticate_redirect()
    """

    _OPENID_ENDPOINT = "https://steamcommunity.com/openid/login"

    def _on_authentication_verified(self, future, response):
        if response.error or b"is_valid:true" not in response.body:
            future.set_exception(tornado.auth.AuthError(
                "Invalid OpenID response: %s" % (response.error or
                                                 response.body)))
            return

        # Since we only get claimed_id from Steam's OpenID, 
        # check it for correctness and return the actual 64-bit UserID
        # Ref: http://steamcommunity.com/dev/

        user = None
        claimed_id = self.get_argument("openid.claimed_id", None)
        if claimed_id and claimed_id[:36] == "http://steamcommunity.com/openid/id/":
            user = claimed_id[36:]

        future.set_result(user)

class SteamAuthHandler(tornado.web.RequestHandler, SteamOpenIdMixin):
    @tornado.gen.coroutine
    def get(self):
        if self.get_argument("openid.mode", None):
            # Authentication redirect back to us with user data            
            user = yield self.get_authenticated_user()
            # Do shit with user
            self.write('Authorized as ' + str(user))
        else:
            yield self.authenticate_redirect()
