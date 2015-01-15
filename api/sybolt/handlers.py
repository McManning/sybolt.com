
import sybolt.web
import sybolt.models

# Import for status codes
# see: http://python.readthedocs.org/en/latest/library/http.client.html#http.client.responses
import http.client

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
        