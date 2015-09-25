
from flask import send_from_directory
from sybolt import app

if __name__ == '__main__':
    app.run(use_reloader=True)
