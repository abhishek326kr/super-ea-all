import sqlite3
import textwrap

db_path = r"e:\ourproject\algotrading\prisma\dev.db"

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, title, status, author, createdAt FROM Blog ORDER BY createdAt DESC LIMIT 5")
    rows = cursor.fetchall()
    
    if not rows:
        print("The Blog table is empty. No blogs have been injected yet.")
    else:
        print(f"Found {len(rows)} recent blog posts:")
        for row in rows:
            print(f"- ID: {row[0]} | Title: {textwrap.shorten(row[1], width=50)} | Status: {row[2]} | Author: {row[3]} | Date: {row[4]}")
            
except Exception as e:
    print(f"Error querying database: {e}")
finally:
    if 'conn' in locals():
        conn.close()
