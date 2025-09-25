from datetime import datetime, timedelta
from app import db, Attack, Alert, app

with app.app_context():
    # Drop and recreate tables
    db.drop_all()
    db.create_all()

    now = datetime.utcnow()

    # --- Seed Alerts ---
    alerts = [
        Alert(
            src_ip="192.168.1.50",
            dst_ip="192.168.1.10",
            signature="Lol SSH login attempt",
            severity="high",
            timestamp=now - timedelta(minutes=20)
        ),
        Alert(
            src_ip="10.0.0.123",
            dst_ip="192.168.1.10",
            signature="SQL Injection in HTTP request",
            severity="medium",
            timestamp=now - timedelta(minutes=15)
        ),
        Alert(
            src_ip="172.16.5.7",
            dst_ip="192.168.1.12",
            signature="Malware download blocked",
            severity="critical",
            timestamp=now - timedelta(minutes=10)
        ),
    ]
    db.session.add_all(alerts)

    # --- Seed Attacks ---
    attacks = [
        Attack(
            ip="192.168.1.50",
            status="redirected",
            first_seen=now - timedelta(minutes=25),
            last_seen=now - timedelta(minutes=20),
            vector="SSH brute-force",
            geo="US"
        ),
        Attack(
            ip="10.0.0.123",
            status="pending",
            first_seen=now - timedelta(minutes=18),
            last_seen=now - timedelta(minutes=15),
            vector="SQL Injection",
            geo="UK"
        ),
        Attack(
            ip="203.0.113.99",
            status="pending",
            first_seen=now - timedelta(minutes=7),
            last_seen=now - timedelta(minutes=5),
            vector="Port scan",
            geo="FR"
        ),
        Attack(
            ip="192.0.2.44",
            status="redirected",
            first_seen=now - timedelta(hours=1, minutes=30),
            last_seen=now - timedelta(hours=1, minutes=25),
            vector="RDP brute-force",
            geo="US"
        ),
    ]
    db.session.add_all(attacks)

    db.session.commit()
    print("✅ Database seeded multiple attacks and alerts!")
