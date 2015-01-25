
import os

# Tornado imports
import tornado.auth
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

from tornado.options import define, options
from tornado.web import url

# SQLAlchemy imports
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

# Application imports
import sybolt.models
import sybolt.handlers
import movienight.handlers
import mumble.handlers

# Options
define("port", default=8888, help="Port to run the process", type=int)
define("debug", default=True, type=bool)
define("db_path", default="sqlite:///:memory:", type=str)

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r'/api/profile/([0-9]+)', sybolt.handlers.ProfileHandler),
            (r'/api/profile', sybolt.handlers.ProfileHandler),
            (r'/api/authenticate', sybolt.handlers.AuthHandler),
            (r'/api/live/schedule/id/([0-9]+)', movienight.handlers.LiveScheduleHandler),
            (r'/api/live/schedule/year/([0-9]+)/month/([0-9]+)', movienight.handlers.LiveScheduleHandler),
            (r'/api/movienight/recommendation/([0-9]+)', movienight.handlers.RecommendationHandler),
            (r'/api/movienight/recommendation', movienight.handlers.RecommendationHandler),
            (r'/api/mumble/posts/page/([0-9]+)', mumble.handlers.MumblePostsHandler),
            (r'/api/steam/authenticate', sybolt.handlers.SteamAuthHandler),
            # ...
            (r'(.*)', sybolt.handlers.NotFoundHandler)
        ]

        settings = dict(
            debug=options.debug,
            cookie_secret="jdsag98j3w89jsd98gj89dgh8j89jwg89ajsdgsjdgasdgjjCOCKS"
        )

        tornado.web.Application.__init__(self, handlers, **settings)
        engine = create_engine(
            options.db_path, 
            convert_unicode=True, 
            echo=options.debug
        )

        sybolt.models.Base.metadata.create_all(bind=engine)
        self.db = scoped_session(sessionmaker(bind=engine))

        # Prefill with some test data, for shits and giggles
        # TODO: Move this
"""
        # Set up some testing profiles
        chase = sybolt.models.SyboltProfile(
            display_name='Chase', 
            email='chase@sybolt.com'
        )
        
        chase.minecraft_profile = sybolt.models.MinecraftProfile(
            username='Noligorithm', 
            last_login_time=datetime.now(), 
            last_login_ip='127.0.0.1'
        )
        
        chase.murmur_profile = sybolt.models.MurmurProfile(
            username='Chase',
            last_login_time=datetime.now(),
            last_login_ip='127.0.0.1'
        )
        
        mark = sybolt.models.SyboltProfile(
            display_name='Mark',
            email='jamacavoy@hotmail.com'
        )
        
        mark.minecraft_profile = sybolt.models.MinecraftProfile()
        mark.minecraft_profile.username = 'jamacavoy'
        
        mark.murmur_profile = sybolt.models.MurmurProfile(
            username='MarkMeltzer'
        )
    
        movie = movienight.models.MovieRecommendation()
        movie.title = 'Django Unchained'
        movie.poster_url = '/cache/posters/django_unchained.jpg'
        movie.profile = chase
        self.db.add(movie)

        movie_night = movienight.models.MovieNight()
        movie_night.profile = mark
        movie_night.date = datetime.strptime('2015-12-25', '%Y-%m-%d')
        movie_night.title = 'Something Gay'
        movie_night.poster_url = '/cache/posters/gayshit.jpg'
        movie_night.recommendations.append(movie)
        movie_night.synopsis = 'Test movie'

        self.db.add(movie_night)

        self.db.commit()
"""

def main():
    tornado.options.parse_command_line()
    
    print("Setting up Application")
    http_server = tornado.httpserver.HTTPServer(Application())

    print("Listening on %d" % options.port)
    http_server.listen(options.port)

    if options.debug:
        try:
            print("Starting IOLoop")
            tornado.ioloop.IOLoop.instance().start()
        except KeyboardInterrupt:
            print("Caught KeyboardInterrupt. Gracefully shutting down IOLoop")
            tornado.ioloop.IOLoop.instance().stop()
    else:
        # Don't catch keyboard interrupts unless we're debugging
        tornado.ioloop.IOLoop.instance().start()

    print("Stopping application")

if __name__ == '__main__':
    main()










