# # app.py
# from datetime import datetime, timedelta
# from flask import Flask, jsonify, request
# from flask_sqlalchemy import SQLAlchemy
# from flask_cors import CORS
# import threading

# # -----------------------------
# # Flask Setup
# # -----------------------------
# app = Flask(__name__)
# CORS(app)

# # SQLite database setup
# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///shadowtrap.db"
# app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# db = SQLAlchemy(app)


# # -----------------------------
# # Database Models
# # -----------------------------
# class Alert(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     src_ip = db.Column(db.String(50))
#     dst_ip = db.Column(db.String(50))
#     signature = db.Column(db.String(200))
#     severity = db.Column(db.String(20))
#     timestamp = db.Column(db.DateTime)


# class Attack(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     ip = db.Column(db.String(50))
#     status = db.Column(db.String(20))
#     first_seen = db.Column(db.DateTime)
#     last_seen = db.Column(db.DateTime)
#     vector = db.Column(db.String(100))
#     geo = db.Column(db.String(50))


# # -----------------------------
# # API Routes
# # -----------------------------
# @app.route("/api/alerts", methods=["GET"])
# def get_alerts():
#     alerts = Alert.query.order_by(Alert.timestamp.desc()).limit(50).all()
#     return jsonify([
#         {
#             "id": a.id,
#             "src_ip": a.src_ip,
#             "dst_ip": a.dst_ip,
#             "signature": a.signature,
#             "severity": a.severity,
#             "timestamp": a.timestamp.strftime("%Y-%m-%d %H:%M:%S UTC")
#         }
#         for a in alerts
#     ])


# @app.route("/api/actions", methods=["POST"])
# def take_action():
#     data = request.json
#     # In the future, this can trigger honeypot redirect or blocking
#     return jsonify({"ok": True, "received": data})


# @app.route("/api/system/health", methods=["GET"])
# def system_health():
#     return jsonify({
#         "ids": "running",
#         "honeypot": "running",
#         "backend": "ok"
#     })


# @app.route("/api/totals", methods=["GET"])
# def get_totals():
#     now = datetime.utcnow()
#     past_24h = now - timedelta(hours=24)
#     attacks_all = Attack.query.all()
#     total_attacks = len(attacks_all)
#     total_attacks_24h_ago = len([a for a in attacks_all if a.last_seen < past_24h])
#     critical = len([a for a in attacks_all if a.status == "pending"])
#     redirected = len([a for a in attacks_all if a.status == "redirected"])
#     alerts_sent = Alert.query.count()
#     return jsonify({
#         "totalAttacks": total_attacks,
#         "totalAttacks24hAgo": total_attacks_24h_ago,
#         "critical": critical,
#         "redirected": redirected,
#         "alertsSent": alerts_sent
#     })


# # -----------------------------
# # Main Application Entry
# # -----------------------------
# if __name__ == "__main__":
#     from monitor import monitor_eve  # import from separate file

#     with app.app_context():
#         db.create_all()

#     # Run Suricata monitoring as background thread
#     thread = threading.Thread(target=monitor_eve, daemon=True)
#     thread.start()

#     print("[+] ShadowTrap backend started on http://0.0.0.0:5001")
#     print("[+] Eve.json monitoring thread launched.")
#     app.run(host="0.0.0.0", port=5001, debug=True)


from datetime import datetime, timedelta
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import threading
import os

# -----------------------------
# Flask Setup
# -----------------------------
app = Flask(__name__)
CORS(app)

# Use the same path as in monitor.py
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "events.db")

# SQLite database setup
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_PATH}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# -----------------------------
# Database Models
# -----------------------------
class NetworkEvent(db.Model):
    __tablename__ = "network_events"

    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.String(100))
    event_type = db.Column(db.String(50))
    src_ip = db.Column(db.String(50))
    src_port = db.Column(db.Integer)
    dest_ip = db.Column(db.String(50))
    dest_port = db.Column(db.Integer)
    proto = db.Column(db.String(20))
    alert_signature = db.Column(db.String(200))
    alert_category = db.Column(db.String(200))
    geo = db.Column(db.String(100))          # 🌍 New column
    vector = db.Column(db.String(100))       # 🧭 New column
    severity = db.Column(db.String(20))      # 🚨 New column


# -----------------------------
# API Routes
# -----------------------------
@app.route("/api/alerts", methods=["GET"])
def get_alerts():
    alerts = NetworkEvent.query.order_by(NetworkEvent.id.desc()).limit(50).all()
    return jsonify([
        {
            "id": a.id,
            "timestamp": a.timestamp,
            "event_type": a.event_type,
            "src_ip": a.src_ip,
            "src_port": a.src_port,
            "dest_ip": a.dest_ip,
            "dest_port": a.dest_port,
            "proto": a.proto,
            "alert_signature": a.alert_signature,
            "alert_category": a.alert_category,
            "geo": a.geo,
            "vector": a.vector,
            "severity": a.severity
        }
        for a in alerts
    ])


@app.route("/api/totals", methods=["GET"])
def get_totals():
    total_alerts = NetworkEvent.query.count()
    last_24h = datetime.utcnow() - timedelta(hours=24)

    # Convert timestamp strings to datetime where possible
    recent_alerts = [
        a for a in NetworkEvent.query.all()
        if a.timestamp and
           datetime.strptime(a.timestamp.split("T")[0], "%Y-%m-%d") >= last_24h
    ]

    return jsonify({
        "totalAttacks": total_alerts,
        "totalAlerts": total_alerts,
        "critical": "-",
        "redirected": "-",
        "recentAlerts24h": len(recent_alerts)
    })


@app.route("/api/attacks", methods=["GET"])
def get_attacks():
    attacks = NetworkEvent.query.order_by(NetworkEvent.id.desc()).limit(50).all()
    # return jsonify([
    #     {
    #         "id": a.id,
    #         "ip": a.ip,
    #         "status": a.status,
    #         "vector": a.vector,
    #         "geo": a.geo
    #     }
    #     for a in attacks
    # ])
    return jsonify([
        {
            "id": a.id,
            "dest_ip": a.src_ip,
            "timestamp": a.timestamp,
            "proto": a.proto,
            "geo": a.geo,
            "vector": a.vector,
            "severity": a.severity
        }
        for a in attacks
    ])


@app.route("/api/attack/<int:attack_id>", methods=["GET"])
def get_attack(attack_id):
    a = NetworkEvent.query.get(attack_id)
    if not a:
        return jsonify({"error": "Not found"}), 404
    return jsonify({
        "id": a.id,
        "ip": a.src_ip,
        "status": a.status,
        "vector": a.vector,
        "geo": a.geo
    })



@app.route("/api/system/health", methods=["GET"])
def system_health():
    return jsonify({
        "ids": "running",
        "honeypot": "running",
        "backend": "ok"
    })


@app.route("/api/actions", methods=["POST"])
def take_action():
    data = request.json
    return jsonify({"ok": True, "received": data})


# -----------------------------
# Background Thread: Suricata Monitor
# -----------------------------
def start_monitor():
    from monitor import main as monitor_main
    monitor_main()


# -----------------------------
# Main Entry Point
# -----------------------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    # Start monitor.py as a background thread
    monitor_thread = threading.Thread(target=start_monitor, daemon=True)
    monitor_thread.start()

    print("[+] ShadowTrap backend started on http://0.0.0.0:5001")
    print("[+] Monitoring thread launched and connected to events.db")

    app.run(host="0.0.0.0", port=5001, debug=True)
