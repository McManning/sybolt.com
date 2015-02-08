
import http.client
import sybolt.web

import datetime

from movienight.models import *

class LiveScheduleHandler(sybolt.web.RestRequestHandler):

    def post(self, id): # TODO: Fix it so it's a PUT (for some reason, we're not allowed through access control)
        """
        PUT /api/live/schedule/id/1

        Update a specified movie model. 

        Respond with:
            Different status responses (200, 404, 500, etc)
        """
        query = self.application.db.query(MovieNight).filter(MovieNight.id == int(id))
        movie = query.first()

        if not movie:
            json = dict(
                error=http.client.NOT_FOUND,
                id=id
            )
            self.set_status(http.client.NOT_FOUND)
        else:
            movie.date = datetime.datetime.strptime(self.get_argument('date'), '%Y-%m-%d')
            movie.title = self.get_argument('title')
            movie.synopsis = self.get_argument('synopsis')
            movie.trailer = self.get_argument('trailer')
            movie.imdb = self.get_argument('imdb')
            movie.poster = self.get_argument('poster')
            movie.profile = self.get_argument('profile')

            # Save changes to the movie object
            self.application.db.commit()

            # Write out the updated movie as a response
            json = movie.serialize()

        self.write_json(json)


    def get(self, year, month):
        """
        GET /api/live/schedule/year/2015/month/1

        Respond with:
        {
            "title": "January 2015",
            "movies": [
                {
                    "id":1,
                    "date": "2015-01-03",
                    "date_fmt": "JAN 3",
                    "title": "...",
                    "synopsis": "...",
                    "user": "Chase",
                    "trailer": "...",
                    "imdb": "...",
                    "poster": "..."
                },
                ...
            ],
            "links": {
                "last_month": {
                    "title": "December 2014",
                    "link": "/api/live/schedule/year/2014/month/12"
                },
                "next_month": {
                    "title": "February 2015",
                    "link": "/api/live/schedule/year/2015/month/2"
                }
            }
        }
        """

        search_month = datetime.date(int(year), int(month), 1)

        # get the last month and next month for paginating through the calendar
        last_month = search_month - datetime.timedelta(days=1)
        if int(month) < 12:
            next_month = datetime.date(int(year), int(month)+1, 1)
        else:
            next_month = datetime.date(int(year)+1, 1, 1)


        # Pull up all movies in our database within the specified month
        # Assuming we store the date field as: Y-m-d

        movies = self.application.db.query(MovieNight)\
            .filter(MovieNight.date.between(search_month, next_month))\
            .order_by(MovieNight.date)\
            .all()

        # Finally compile our results into a JSON response 
        json = dict(
            title = '%s %s' % (search_month.strftime('%B'), search_month.year),
            movies = [m.serialize() for m in movies],
            links = dict(
                last_month = dict(
                    title = '%s %s' % (last_month.strftime('%B'), last_month.year),
                    link = 'http://' + options.domain + ':' + options.port + '/api/live/schedule/year/%s/month/%s' % (last_month.year, last_month.month)
                ),
                next_month = dict(
                    title = '%s %s' % (next_month.strftime('%B'), next_month.year),
                    link = 'http://' + options.domain + ':' + options.port + '/api/live/schedule/year/%s/month/%s' % (next_month.year, next_month.month)
                )
            )
        )

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

    def post(self, id): # TODO: Fix it so it's a PUT (for some reason, we're not allowed through access control)
        """
        PUT /api/live/schedule/id/1

        Update a specified movie model. 

        Respond with:
            Different status responses (200, 404, 500, etc)
        """
        query = self.application.db.query(MovieNight).filter(MovieNight.id == int(id))
        movie = query.first()

        if not movie:
            json = dict(
                error=http.client.NOT_FOUND,
                id=id
            )
            self.set_status(http.client.NOT_FOUND)
        else:
            movie.date = datetime.datetime.strptime(self.get_argument('date'), '%Y-%m-%d')
            movie.title = self.get_argument('title')
            movie.synopsis = self.get_argument('synopsis')
            movie.trailer = self.get_argument('trailer')
            movie.imdb = self.get_argument('imdb')
            movie.poster = self.get_argument('poster')
            movie.profile = self.get_argument('profile')

            # Save changes to the movie object
            self.application.db.commit()

            # Write out the updated movie as a response
            json = movie.serialize()

        self.write_json(json)


    def get(self, year, month):
        """
        GET /api/live/schedule/year/2015/month/1

        Respond with:
        {
            "title": "January 2015",
            "movies": [
                {
                    "id":1,
                    "date": "2015-01-03",
                    "date_fmt": "JAN 3",
                    "title": "...",
                    "synopsis": "...",
                    "user": "Chase",
                    "trailer": "...",
                    "imdb": "...",
                    "poster": "..."
                },
                ...
            ],
            "links": {
                "last_month": {
                    "title": "December 2014",
                    "link": "/api/live/schedule/year/2014/month/12"
                },
                "next_month": {
                    "title": "February 2015",
                    "link": "/api/live/schedule/year/2015/month/2"
                }
            }
        }
        """

        search_month = datetime.date(int(year), int(month), 1)

        # get the last month and next month for paginating through the calendar
        last_month = search_month - datetime.timedelta(days=1)
        if int(month) < 12:
            next_month = datetime.date(int(year), int(month)+1, 1)
        else:
            next_month = datetime.date(int(year)+1, 1, 1)


        # Pull up all movies in our database within the specified month
        # Assuming we store the date field as: Y-m-d

        movies = self.application.db.query(MovieNight)\
            .filter(MovieNight.date.between(search_month, next_month))\
            .order_by(MovieNight.date)\
            .all()

        # Finally compile our results into a JSON response 
        json = dict(
            title = '%s %s' % (search_month.strftime('%B'), search_month.year),
            movies = [m.serialize() for m in movies],
            links = dict(
                last_month = dict(
                    title = '%s %s' % (last_month.strftime('%B'), last_month.year),
                    link = '/api/live/schedule/year/%s/month/%s' % (last_month.year, last_month.month)
                ),
                next_month = dict(
                    title = '%s %s' % (next_month.strftime('%B'), next_month.year),
                    link = '/api/live/schedule/year/%s/month/%s' % (next_month.year, next_month.month)
                )
            )
        )

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
