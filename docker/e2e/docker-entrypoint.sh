#!/usr/bin/env bash

echo "Starting Xvfb"
Xvfb :99 -ac &
sleep 5

pm2 start pm2-e2e.json

export DISPLAY=:99
echo "Executing command $@"

exec "$@"
