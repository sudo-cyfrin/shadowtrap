# core/traffic_redirector.py

import re
import time
import subprocess
from pathlib import Path
from utils.logger import log_event

SURICATA_LOG = Path("logs/suricata/fast.log")
BLOCKED_IPS = set()

def block_and_redirect(ip):
    if ip in BLOCKED_IPS:
        return
    BLOCKED_IPS.add(ip)

    print(f"[+] Blocking & redirecting suspicious IP: {ip}")

    subprocess.run(["iptables", "-A", "INPUT", "-s", ip, "-j", "DROP"])
    subprocess.run([
        "iptables", "-t", "nat", "-A", "PREROUTING", "-s", ip,
        "-p", "tcp", "--dport", "22", "-j", "REDIRECT", "--to-port", "2222"
    ])
    log_event(f"IP {ip} redirected to honeypot on port 2222")

def monitor_suricata():
    print("[*] Monitoring Suricata alerts...")
    if not SURICATA_LOG.exists():
        print(f"[!] Suricata log file not found: {SURICATA_LOG}")
        return

    with open(SURICATA_LOG, "r") as f:
        f.seek(0, 2)  # jump to end of file
        while True:
            line = f.readline()
            if not line:
                time.sleep(0.1)
                continue

            if "Potential Nmap SYN Scan Detected" in line:
                match = re.search(r"{TCP} (\d+\.\d+\.\d+\.\d+):", line)
                if match:
                    ip = match.group(1)
                    block_and_redirect(ip)
