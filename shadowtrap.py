# /usr/bin/python
from honeypot.start_opencanary import start_honeypot
from core.traffic_redirector import monitor_suricata

def main():
    print("[*] ShadowTrap initializing...")
    start_honeypot()
    monitor_suricata()

if __name__ == "__main__":
    main()
