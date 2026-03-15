# beautify.py
from datetime import datetime

# --- Timestamp Formatter ---
def format_timestamp(ts: str) -> str:
    """Convert Suricata timestamp to human-friendly format."""
    try:
        dt = datetime.strptime(ts, "%Y-%m-%dT%H:%M:%S.%fZ")
        return dt.strftime("%d %b %Y, %I:%M:%S %p")  # e.g. 25 Sep 2025, 05:42:55 PM
    except Exception:
        return ts or "Unknown"

# --- Severity Beautifier ---
def format_severity(level: int) -> str:
    """Convert Suricata severity number to label."""
    mapping = {
        1: "high 🔥",
        2: "medium ⚠️",
        3: "low 💤"
    }
    return mapping.get(level, "unknown")

# --- IP Beautifier ---
def format_ip(ip: str) -> str:
    """Return internal/external tag for IP addresses."""
    if ip.startswith("192.") or ip.startswith("10.") or ip.startswith("172."):
        return f"{ip} (Internal)"
    return f"{ip} 🌍"

# --- Alert Name Cleanup ---
def format_alert_name(name: str) -> str:
    """Simplify or prettify alert names."""
    if not name:
        return "Unknown Threat"
    name = name.replace("SURICATA", "").replace("ET SCAN", "").strip()
    return name.capitalize()

# --- Beautify whole event ---
def beautify_event(event: dict) -> dict:
    """Apply all beautification to a Suricata event dict."""
    return {
        "timestamp": format_timestamp(event.get("timestamp")),
        "src_ip": format_ip(event.get("src_ip", "Unknown")),
        "country": event.get("geoip", {}).get("country_name", "Unknown"),
        "alert_name": format_alert_name(event.get("alert", {}).get("signature")),
        "severity": format_severity(event.get("alert", {}).get("severity", 3)),
    }
