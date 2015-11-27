
from sybolt import app

if __name__ == '__main__':
    app.logger.info('Starting instance')
    app.run(use_reloader=True)
