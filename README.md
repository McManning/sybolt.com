# sybolt.com
Main website framework

## Requirements
* Nginx
* Gunicorn
* Supervisor
* `www-data:www-data` account for Nginx/Gunicorn

## Configurations
### Nginx

In `/etc/nginx/sites-available/sybolt.com`
```
upstream gunicorn_pool {
  server unix:/var/local/sybolt/gunicorn.sock fail_timeout=0;
}

# Redirection server for HTTP->HTTPS
server {
  listen 80;
  server_name sybolt.com;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl;

  server_name sybolt.com;

  # SSL settings omitted

  # Non-Gunicorn routing settings omitted

  # Forward other requests to Gunicorn
  location / {
    proxy_pass         http://gunicorn_pool;
    proxy_redirect     off;
    proxy_set_header   Host             $host;
    proxy_set_header   X-Real-IP        $remote_addr;
    proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
  }
}
```

### Gunicorn
After installing via `pip3`, had to add a executable to `/usr/local/bin/gunicorn`
```
#!/usr/bin/python3
import re
import sys

from gunicorn.app.wsgiapp import run

if __name__ == '__main__':
  sys.argv[0] = re.sub(r'(-script\.pyw|\.exe)?$','',sys.argv[0])
  sys.exit(run())
```

Rest is handled via the Supervisor process

### Supervisor
In `/etc/supervisor/conf.d/sybolt.conf`
```
[program:sybolt]
user = www-data
directory = /var/www/prod/sybolt
command =
  gunicorn sybolt.wsgi:application
  --name "sybolt_prod"
  --workers 3
  --user=www-data --group=www-data
  --bind=unix:/var/local/sybolt/gunicorn.sock
  --log-level=debug
  --log-file=-
autostart = true
autorestart = true
stdout_logfile = /var/log/nginx/sybolt/gunicorn_supervisor.log
redirect_stderr = true
environment =
  DJANGO_SETTINGS_MODULE="sybolt.settings.production",
  DJANGO_SECRET_KEY="[REDACTED]",
  TMDB_API_KEY="[REDACTED]",
  MURMUR_SECRET="[REDACTED]"
```


## Deployment
Pretty much amounts to:
```
supervisorctl stop sybolt
cd /var/www/prod
rm -rf sybolt
git clone --depth=1 https://github.com/McManning/sybolt.com.git sybolt
cd sybolt
rm -rf .git
chown www-data:www-data -R .
supervisorctl start sybolt
```

### Areas of interest
* `/var/www/prod/sybolt` - deployed site
* `/var/local/sybolt` - databases and sockets
* `/var/log/nginx/sybolt` - log files (should probably be reorganized...)
* `/var/cache/sybolt/tmdb` - Cached TMDB API records
* `/etc/letsencrypt` - SSL cert storage
* `/home/chase/letsencrypt` - SSL cert generator (needs to be moved...)

### Let's Encrypt SSL
Last renewal (on 160123) spawned a new `/etc/letsencrypt/live/sybolt.com-0001` instead of replacing the old cert, so I need to keep an eye on that for next renewal so make sure I can actually automate it 
