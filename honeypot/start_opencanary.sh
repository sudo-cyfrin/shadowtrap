#!/bin/bash

echo "[*] Starting OpenCanary honeypot in virtual environment..."

VENV_PATH="venv-honeypot"
OPENCANARYD="$VENV_PATH/bin/opencanaryd"
PIDFILE="venv-honeypot/bin/opencanaryd.pid"
LOGFILE="venv-honeypot/bin/opencanaryd.log"

# Ensure log directory exists
mkdir -p logs/honeypot

# Check if already running
if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
    echo "[!] OpenCanary already running (PID: $(cat "$PIDFILE"))"
    exit 1
fi

source venv-honeypot/bin/activate

opencanaryd --start \
  --pidfile logs/honeypot/opencanaryd.pid \
  --logfile logs/honeypot/opencanary.log \
  --uid nobody --gid nogroup
  
echo "[+] OpenCanary started successfully."
