
from flask import Flask, render_template
#from flask.ext.sqlalchemy import SQLAlchemy
#from sybolt.live.routes import live as live_blueprint

app = Flask(__name__, static_url_path='')
app.config.from_object('config.DevelopmentConfig')
#db = SQLAlchemy(app)

# Register blueprint routes
from sybolt.routes import site
app.register_blueprint(site)
#app.register_blueprint(live_blueprint)

from sybolt.database import init_db
init_db()
