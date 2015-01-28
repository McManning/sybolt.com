
import tornado.web
import tornado.escape
import functools
import http.client
from tornado.log import access_log, app_log, gen_log

from sybolt.models import SyboltProfile

class RestRequestHandler(tornado.web.RequestHandler):
	def set_default_headers(self):
		# Enable CORS support for requests
		# See http://stackoverflow.com/questions/5584923/a-cors-post-request-works-from-plain-javascript-but-why-not-with-jquery
		self.set_header("Access-Control-Allow-Origin", "*")
		# self.set_header("Access-Control-Allow-Credentials", "true")
		self.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		self.set_header("Access-Control-Allow-Headers", "x-requested-with, accept, content-type") #, accept, authorization, origin")
		
		# Cannot use wildcard in Access-Control-Allow-Origin when credentials flag is true
		# self.set_header("Access-Control-Allow-Origin", "http://localhost")
	
	def write_json(self, json):
		self.set_header("Content-Type", "application/json")

		callback = self.get_argument('callback', default=None)
		encoded_json = tornado.escape.json_encode(json)

		if callback is not None:
			self.write("%s(%s)" % (callback, encoded_json))
		else:
			self.write(encoded_json)

	def set_current_user(self, sybolt_profile):
		"""
		Assign .current_user to a given SyboltProfile. 
		This will generate a new hash for that profile, cache it, 
		and provide a cookie for the end user. 
		"""
		if not sybolt_profile:
			self.clear_cookie("user")
		else:
			access_log.info("Creating secure login for profile id=%i", sybolt_profile.id)

			json = dict(
				id=sybolt_profile.id,
				hash='SOMEBULLSHIT'
			)

			self.set_secure_cookie("user", tornado.escape.json_encode(json))

	def get_current_user(self):
		"""
		Return the SyboltProfile associated with the currently 
		logged in user. Or None, if a user is not currently logged in. 
		"""
		# for now, just return the cookie
		cookie = self.get_secure_cookie("user")

		profile = None
		if cookie:
			# TODO: Obviously, make this shit waaaay more secure.
			try:
				data = tornado.escape.json_decode(cookie)

				query = self.application.db.query(SyboltProfile)\
					.filter(SyboltProfile.id == data['id'])\
					.filter(SyboltProfile.last_login_ip == self.request.remote_ip)

				profile = query.first()
			except Exception as e:
				app_log.error('Exception while setting current_user: %s', str(e))
				profile = None

		return profile

		
def require_auth(method):
    """
    Decorator for methods that require a user to be logged in. 
    If a method is accessed without the user being logged in, this will
    instead respond with a 403 UNAUTHORIZED.

    TODO: Eventually this will also check the authentication level of the user.
    (ie: Administrator, developer, guest, etc)
    """
    @functools.wraps(method)
    def wrapper(self, *args, **kwargs):
        if not self.current_user:
        	#raise HTTPError(403)
        	self.set_status(http.client.UNAUTHORIZED)
	        return self.write_json(dict(
	        	error=http.client.UNAUTHORIZED, 
	        	message='This resource requires authentication.'
	        ))

        return method(self, *args, **kwargs)
    return wrapper