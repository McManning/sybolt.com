
import http.client
import sybolt.web

from movienight.models import *

class MovieNightHandler(sybolt.web.RestRequestHandler):
    def get(self, date = None):

        try:
            # If a bad format is provided, catch it and fail
            date_fmt = datetime.strptime(date, '%Y-%m-%d')

            # Find our movie in the database
            movie_night = self.application.db.query(MovieNight).filter(MovieNight.date == date_fmt).first()
        except ValueError:
            movie_night = None

        if movie_night:
            json = movie_night.serialize()
        else:
            json = dict(
                error=http.client.NOT_FOUND
            )
            self.set_status(http.client.NOT_FOUND)
        
        self.write_json(json)


class RecommendationHandler(sybolt.web.RestRequestHandler):
    def get(self, id = None):
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
