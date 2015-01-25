
import tornado.web
import tornado.escape

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
	
	def __get(self, path):
		self.handle_request('get', path)

	def __post(self, path):
	
		# basic authentication via POST
		auth = self.get_argument('auth')
		if auth != 'Manticore':
			self.set_status(401)
		else:
			self.handle_request('post', path)

	def __delete(self, path):
		# @todo permission handling
		self.handle_request('delete', path)

	def __handle_request(self, method, path):
		"""
			Route all requests to proper handler methods 
		"""
		params = path.split('/')
		method = method + '_' + params.pop(0)
		
		#try:
		getattr(self, method)(params)
		#except AttributeError:
		#	self.write('Invalid action, no ' + method)
	
	def write_json(self, json):
		self.set_header("Content-Type", "application/json")

		callback = self.get_argument('callback', default=None)
		encoded_json = tornado.escape.json_encode(json)

		if callback is not None:
			self.write("%s(%s)" % (callback, encoded_json))
		else:
			self.write(encoded_json)
		