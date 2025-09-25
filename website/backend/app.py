from datetime import datetime, timedelta
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# SQLite database in same folder
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///shadowtrap.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# -----------------------------
# Models
# -----------------------------
class Alert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    src_ip = db.Column(db.String(50))
    dst_ip = db.Column(db.String(50))
    signature = db.Column(db.String(200))
    severity = db.Column(db.String(20))
    timestamp = db.Column(db.DateTime)

class Attack(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ip = db.Column(db.String(50))
    status = db.Column(db.String(20))
    first_seen = db.Column(db.DateTime)
    last_seen = db.Column(db.DateTime)
    vector = db.Column(db.String(100))
    geo = db.Column(db.String(50))

# -----------------------------
# API Routes
# -----------------------------
@app.route("/api/alerts", methods=["GET"])
def get_alerts():
    alerts = Alert.query.all()
    return jsonify([{
        "id": a.id,
        "src_ip": a.src_ip,
        "dst_ip": a.dst_ip,
        "signature": a.signature,
        "severity": a.severity,
        "timestamp": a.timestamp.isoformat() + "Z"
    } for a in alerts])

@app.route("/api/attacks", methods=["GET"])
def get_attacks():
    attacks = Attack.query.all()
    return jsonify([{
        "id": a.id,
        "ip": a.ip,
        "status": a.status,
        "first_seen": a.first_seen.isoformat() + "Z",
        "last_seen": a.last_seen.isoformat() + "Z",
        "vector": a.vector,
        "geo": a.geo
    } for a in attacks])

@app.route("/api/attack/<int:attack_id>", methods=["GET"])
def get_attack(attack_id):
    a = Attack.query.get(attack_id)
    if not a:
        return jsonify({"error": "Not found"}), 404
    return jsonify({
        "id": a.id,
        "ip": a.ip,
        "status": a.status,
        "first_seen": a.first_seen.isoformat() + "Z",
        "last_seen": a.last_seen.isoformat() + "Z",
        "vector": a.vector,
        "geo": a.geo
    })

@app.route("/api/actions", methods=["POST"])
def take_action():
    data = request.json
    return jsonify({"ok": True, "received": data})

@app.route("/api/system/health", methods=["GET"])
def system_health():
    return jsonify({
        "ids": "running",
        "honeypot": "running",
        "backend": "ok"
    })

@app.route("/api/totals", methods=["GET"])
def get_totals():
    now = datetime.utcnow()
    past_24h = now - timedelta(hours=24)
    attacks_all = Attack.query.all()
    total_attacks = len(attacks_all)
    total_attacks_24h_ago = len([a for a in attacks_all if a.last_seen < past_24h])
    critical = len([a for a in attacks_all if a.status == "pending"])
    redirected = len([a for a in attacks_all if a.status == "redirected"])
    alerts_sent = Alert.query.count()
    return jsonify({
        "totalAttacks": total_attacks,
        "totalAttacks24hAgo": total_attacks_24h_ago,
        "critical": critical,
        "redirected": redirected,
        "alertsSent": alerts_sent
    })

# -----------------------------
# Main
# -----------------------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5001, debug=True)
