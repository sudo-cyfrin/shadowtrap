import sqlite3

conn = sqlite3.connect('events.db')
cur = conn.cursor()

cur.execute("SELECT * FROM network_events")
rows = cur.fetchall()

for row in rows:
    print(row)

conn.close()
