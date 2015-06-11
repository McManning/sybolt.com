
import http.client
import sybolt.web

import datetime
import json

#from mumble.models import *

import sqlite3

sybolt_db_conn = sqlite3.connect('../sybot.db')
sybolt_db_conn.row_factory = sqlite3.Row # allowing row access by name

class MumblePostsHandler(sybolt.web.RestRequestHandler):

    def get(self, page):
        """
        GET /api/mumble/posts/page/2

        Respond with:
        {
            "nicknames": [
                "Chase",
                "Jigs",
                "Gfro",
                ...
            ],
            "media": [
                "video",
                "image",
                "imgur",
                "steam",
                ...
            ]
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
                "next_page": "/mumble/posts/page/3",
                "previous_page": "/mumble/posts/page/1"
            }
        }
        """

        PAGE_SIZE = 50 # Posts per page

        # Retrieve posts that match the filter range
        #query = self.application.db.query(MumblePost)
        #posts = query[int(page)*PAGE_SIZE:int(page)*PAGE_SIZE + PAGE_SIZE]

        # While it'd be ideal to work with our SQLAlchemy model (since it's literally
        # only two lines of code), the mumble data is stored in a separate sqlite 
        # database (for now). So, instead, we're going to just interact directly 
        # with that to get what we want. Will optimize/un-hardcode later, I swear!

        # Query to obtain the posts themselves
        posts_query = """
            SELECT 
                    nickname, 
                    time AS date, 
                    'image' AS type, 
                    filename AS url, 
                    '{{"width":' || width || ',"height":' || height || '}}' AS metadata 
            FROM 
                    images
            UNION
            SELECT 
                    nickname, 
                    time AS date, 
                    CASE WHEN (url LIKE '%youtu%') THEN 'video'
                    WHEN (url LIKE '%imgur%jpg' OR url LIKE '%imgur%png' OR url LIKE '%imgur%gif') THEN 'imgur'
                    WHEN (url LIKE '%steamcommunity%' OR url LIKE '%steampowered%') THEN 'steam'
                    WHEN (url LIKE '%tumblr%jpg' OR url LIKE '%tumblr%gif' OR url LIKE '%tumblr%png') THEN 'tumblr'
                    ELSE 'url' END AS type,       
                    url,
                    NULL AS metadata 
            FROM
                    urls
            WHERE
                type = 'video'   
            ORDER BY 
                    date      
                    DESC
            LIMIT
                {0}
            OFFSET 
                {1}
        """

        # NOTE: Type filter (type = 'video') is because on the frontend, we don't have dimension
        # information for externally hosted images, and the Isotope doesn't like to reflow after
        # it loads images. Either the image can go into a fixed size container (ehh) or we
        # scrape for dimensions behind the scenes (also ehh)

        # Format for pagination
        posts_query = posts_query.format(PAGE_SIZE, int(page) * PAGE_SIZE)
        print(posts_query)

        # Filterable nicknames 
        nicknames_query = """
            SELECT DISTINCT nickname FROM images
            UNION
            SELECT DISTINCT nickname FROM urls
        """

        # Filterable media types
        media_types = [
            'image',
            'video',
            'imgur',
            'steam',
            'url'
        ]

        # Run queries
        c = sybolt_db_conn.cursor()

        nicknames = []
        for row in c.execute(nicknames_query):
            nicknames.append(row['nickname'])

        posts = []
        n = 0
        for row in c.execute(posts_query):
            post = dict(
                id = int(page) * PAGE_SIZE + n, # We don't actually have an ID column yet...
                nickname = row['nickname'],
                date = row['date'],
                type = row['type'],
                url = row['url'],
                metadata = json.loads(row['metadata']) if row['metadata'] else None
            )
            n = n+1
            posts.append(post)


        # Finally compile our results into a JSON response 
        json_result = dict(
            nicknames = nicknames,
            media = media_types,
            posts = posts,
            links = dict(
                # TODO: Clean these up and only add if applicable
                # SHOULD be full URIs
                next_page = '/mumble/posts/page/%i' % (int(page) + 1), 
                previous_page = '/mumble/posts/page/%i' % (int(page) - 1)
            )
        )

        self.write_json(json_result)


