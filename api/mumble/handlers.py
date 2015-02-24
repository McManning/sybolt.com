
import http.client
import sybolt.web

import datetime
import json

from mumble.models import *

class MumbleIdentityHandler(sybolt.web.RestRequestHandler):
    def put(self, id = None):

    def post(self, id = None):
        """
        POST /api/identity/mumble 

        Create a new identity entry
        Expect:
            nickname
            password

        Respond with:
        
        """

class MumblePostsHandler(sybolt.web.RestRequestHandler):

    def get(self, page):
        """
        GET /api/mumble/posts/page/2

        Respond with:
        {
            "posts": [
                {
                    "id":1,
                    "type":"image",
                    "date": "2015-01-03 00:00:00",
                    "url": "...".
                    "nickname": "...",
                    "metadata": {
                        "width": 1,
                        "height": 1
                    }
                },
                {
                    "id":2,
                    "type":"video",
                    "date": "2015-01-03 00:00:00",
                    "url": "...".
                    "nickname": "...",
                    "metadata": null
                },
                ...
            ],
            "links": {
                "next_page": "/api/mumble/posts/page/3",
                "previous_page": "/api/mumble/posts/page/1"
            }
        }
        """

        PAGE_SIZE = 100 # Posts per page

        # Retrieve posts that match the filter range
        query = self.application.db.query(MumblePost)

        posts = query[int(page)*PAGE_SIZE:int(page)*PAGE_SIZE + PAGE_SIZE]

        # Finally compile our results into a JSON response 
        json = dict(
            posts = [p.serialize() for p in posts],
            links = dict(
                # TODO: Clean these up and only add if applicable
                next_page = '/api/mumble/posts/page/%i' % (int(page) + 1), 
                previous_page = '/api/mumble/posts/page/%i' % (int(page) - 1)
            )
        )

        self.write_json(json)
