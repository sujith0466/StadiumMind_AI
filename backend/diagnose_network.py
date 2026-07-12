import os
import socket
import traceback
from dotenv import load_dotenv

def mask_url(url):
    if not url: return "NONE"
    if "@" in url:
        parts = url.split("@")
        creds = parts[0].split("://")
        return f"{creds[0]}://{creds[1].split(':')[0]}:***@{parts[1]}"
    return url

def main():
    print("=== NETWORK DIAGNOSIS ===")
    
    # 6 & 7. Verify dotenv and env vars
    env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '.env'))
    print(f"Loading .env from: {env_path}")
    load_dotenv(dotenv_path=env_path, override=True)
    
    db_url = os.environ.get("DATABASE_URL")
    print(f"1. Exact DATABASE_URL (masked): {mask_url(db_url)}")
    
    host = ""
    port = 5432
    if db_url and "@" in db_url:
        host_port = db_url.split("@")[1].split("/")[0]
        if ":" in host_port:
            host, port_str = host_port.split(":")
            port = int(port_str)
        else:
            host = host_port

    print(f"\n3. DNS Resolution for: {host}")
    try:
        ip = socket.gethostbyname(host)
        print(f"Resolved IP: {ip}")
    except socket.gaierror as e:
        print(f"DNS Resolution FAILED: {e}")
        ip = None

    print(f"\n4. TCP Connectivity to {host}:{port}")
    if ip:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(5)
            s.connect((ip, port))
            print("TCP Connection SUCCESS")
            s.close()
        except Exception as e:
            print(f"TCP Connection FAILED: {e}")
    else:
        print("Skipping TCP test due to DNS failure.")

    print("\n2. Full SQLAlchemy/psycopg2 Traceback:")
    try:
        from app import create_app, db
        app = create_app()
        with app.app_context():
            from sqlalchemy import text
            db.session.execute(text("SELECT 1;"))
    except Exception:
        print(traceback.format_exc())

if __name__ == "__main__":
    main()
