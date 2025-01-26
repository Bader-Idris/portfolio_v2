#!/bin/sh
# Start Fail2Ban in the background
fail2ban-server -x -v &

# Start NGINX in the foreground
exec "$@"
