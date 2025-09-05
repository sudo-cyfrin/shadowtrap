# utils/logger.py

from pathlib import Path
import time

LOG_FILE = Path("logs/attacker.log")

def log_event(message):
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(LOG_FILE, "a") as f:
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        f.write(f"[{timestamp}] {message}\n")
