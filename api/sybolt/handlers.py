
import sybolt.web
import sybolt.models

# Import for status codes
# see: http://python.readthedocs.org/en/latest/library/http.client.html#http.client.responses
import http.client

import tornado.auth # For OpenIdMixin

class AuthHandler(sybolt.web.RestRequestHandler):
    def get(self):
        json = dict(
            error=http.client.NOT_IMPLEMENTED,
            message="Coming eventually, maybe."
        )

        self.set_status(http.client.NOT_IMPLEMENTED)
        self.write_json(json)

    def post(self):
        json = dict(
            error=http.client.NOT_IMPLEMENTED,
            message="Coming eventually, maybe."
        )

        self.set_status(http.client.NOT_IMPLEMENTED)
        self.write_json(json)

class ProfileHandler(sybolt.web.RestRequestHandler):
    def get(self, uid = None):
        json = dict(
            error=http.client.NOT_IMPLEMENTED,
            message="Coming eventually, maybe."
        )

        self.set_status(http.client.NOT_IMPLEMENTED)
        self.write_json(json)


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
