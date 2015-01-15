
import tornado.web
from models import *

class BaseHandler(tornado.web.RequestHandler):
    @property
    def db(self):
        return self.application.db

    def get_current_user(self):
        user_id = self.get_secure_cookie("user")
        if not user_id:
            return None

        return self.db.query(SyboltProfile).get(user_id)

class IndexHandler(BaseHandler):
    def get(self):
        self.write('hi')

