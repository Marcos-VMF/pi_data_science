#!/bin/sh
set -e
# Remove symlink if it exists and create a real file
if [ -L /var/log/nginx/access.log ]; then
  rm /var/log/nginx/access.log
  touch /var/log/nginx/access.log
  chown nginx:nginx /var/log/nginx/access.log 2>/dev/null || true
fi
exec nginx -g 'daemon off;'