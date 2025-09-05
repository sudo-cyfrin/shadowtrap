import os
import subprocess
import sys

def create_venv(name):
    print(f"[+] Creating virtual environment: {name}")
    subprocess.run([sys.executable, "-m", "venv", name])
    print(f"[✓] Virtual environment '{name}' created.\n")

def install_requirements(venv_path, req_file):
    pip_path = os.path.join(venv_path, "bin", "pip") if os.name != "nt" else os.path.join(venv_path, "Scripts", "pip.exe")
    print(f"[+] Installing dependencies from {req_file} into {venv_path}")
    result = subprocess.run([pip_path, "install", "-r", req_file])
    if result.returncode == 0:
        print(f"[✓] Installed requirements from {req_file}\n")
    else:
        print(f"[✗] Failed to install some requirements from {req_file}")

def main():
    print("====== ShadowTrap Installer ======\n")

    # Step 1: Create venvs
    create_venv("venv-shadowtrap")
    create_venv("venv-honeypot")

    # Step 2: Install requirements
    install_requirements("venv-shadowtrap", "shadow-requirements.txt")
    install_requirements("venv-honeypot", "opencanary-requirements.txt")

    print("\n====== Setup Complete ======")
    print("➡️  To activate ShadowTrap venv:   source venv-shadowtrap/bin/activate")
    print("➡️  To activate Honeypot venv:    source venv-honeypot/bin/activate")
    print("Then run your modules as needed (IDS, logger, honeypot etc.)\n")

if __name__ == "__main__":
    main()
