import sqlite3

# Connect (or create) a database file
conn = sqlite3.connect('events.db')

# Create a cursor to execute SQL commands
cur = conn.cursor()

# Create the table
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
    alert_category TEXT
)
''')

# Commit changes and close connection
conn.commit()
conn.close()

print("✅ Database and table created successfully.")
