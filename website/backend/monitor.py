import json
import time
import sqlite3
import os
import geoip2.database
from collections import defaultdict

ALERT_SUPPRESS_WINDOW = 60  # seconds
alert_cache = defaultdict(float)

# -----------------------------
# Paths
# -----------------------------
EVE_FILE = r"C:\Program Files\Suricata\log\eve.json"
DB_PATH = os.path.join(os.path.dirname(__file__), "events.db")
GEOIP_DB = os.path.join(os.path.dirname(__file__), "GeoLite2-City.mmdb")

# Initialize GeoIP reader
geo_reader = geoip2.database.Reader(GEOIP_DB)

# -----------------------------
# Initialize database
# -----------------------------
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS network_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            event_type TEXT,
            src_ip TEXT,
            src_port INTEGER,
            dest_ip TEXT,
            dest_port INTEGER,
            proto TEXT,
            alert_signature TEXT,
            alert_category TEXT,
            geo TEXT,
            vector TEXT,
            severity TEXT
        )
    ''')
    conn.commit()
    conn.close()

# -----------------------------
# GeoIP Lookup
# -----------------------------
def get_geoip(ip):
    """Return readable GeoIP location from IP address."""
    try:
        record = geo_reader.city(ip)
        city = record.city.name or ""
        region = record.subdivisions.most_specific.name or ""
        country = record.country.name or ""
        location = ", ".join(filter(None, [city, region, country]))
        return location if location else "Unknown"
    except Exception:
        return "Unknown"

# -----------------------------
# Insert one event
# -----------------------------
def insert_event(event):
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute('''
        INSERT INTO network_events (
            timestamp, event_type, src_ip, src_port,
            dest_ip, dest_port, proto,
            alert_signature, alert_category,
            geo, vector, severity
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        event.get("timestamp"),
        event.get("event_type"),
        event.get("src_ip"),
        event.get("src_port"),
        event.get("dest_ip"),
        event.get("dest_port"),
        event.get("proto"),
        event.get("alert_signature"),
        event.get("alert_category"),
        event.get("geo"),
        event.get("vector"),
        event.get("severity")
    ))
    conn.commit()
    conn.close()

# -----------------------------
# Tail eve.json file
# -----------------------------
def follow(file):
    file.seek(0, os.SEEK_END)
    while True:
        line = file.readline()
        if not line:
            time.sleep(0.5)
            continue
        yield line

# -----------------------------
# Parse one Suricata alert
# -----------------------------
def parse_event(line):
    try:
        data = json.loads(line)
    except json.JSONDecodeError:
        return None

    if data.get("event_type") != "alert":
        return None

    alert = data.get("alert", {})
    signature = alert.get("signature", "")

    # FILTER: Only allow Nmap alerts
    if not signature.startswith("Possible Nmap"):
        return None

    src_ip = data.get("src_ip")
    dest_ip = data.get("dest_ip")
    dest_port = data.get("dest_port")

    # 🔁 Deduplication key
    key = f"{src_ip}:{dest_ip}:{dest_port}:{signature}"
    now = time.time()

    if now - alert_cache[key] < ALERT_SUPPRESS_WINDOW:
        return None

    alert_cache[key] = now

    geo = get_geoip(dest_ip) if dest_ip else "Unknown"

    return {
        "timestamp": data.get("timestamp"),
        "event_type": data.get("event_type"),
        "src_ip": src_ip,
        "src_port": data.get("src_port"),
        "dest_ip": dest_ip,
        "dest_port": dest_port,
        "proto": data.get("proto"),
        "alert_signature": signature,
        "alert_category": alert.get("category"),
        "geo": geo,
        "vector": signature.split()[1] if len(signature.split()) > 1 else "Unknown",
        "severity": "Medium (3)"
    }
# -----------------------------
# Main monitor loop
# -----------------------------
def main():
    print("👀 Watching eve.json for new Suricata alerts...")
    init_db()   

    with open(EVE_FILE, "r", encoding="utf-8") as f:
        for line in follow(f):
            event = parse_event(line)
            if event:
                insert_event(event)

if __name__ == "__main__":
    main()
