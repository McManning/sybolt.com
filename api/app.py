
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
import models
import handlers
from models import base

# Options
define("port", default=8888, help="Port to run the process", type=int)
define("debug", default=False, type=bool)
define("db_path", default="sqlite:////:memory:", type=str)

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            url(r'/', handlers.IndexHandler, name='index'),
            # ...
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

        base.Base.metadata.create_all(bind=engine)
        self.db = scoped_session(sessionmaker(bind=engine))

def main():
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == '__main__':
    main()










