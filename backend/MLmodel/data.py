import sqlite3
import pandas as pd

# Function to fetch data from SQLite DB
def fetch_data_from_db():
    conn = sqlite3.connect("C:\\Users\\21654\\Desktop\\FinalAPI\\backend\\api\\db.sqlite3")  # Update with your DB path
    query = "SELECT user_id, consumption, date FROM consumption_data ORDER BY date ASC"
    df = pd.read_sql(query, conn)
    conn.close()
    
    # Convert 'date' column to datetime and set it as index
    df['date'] = pd.to_datetime(df['date'])
    df.set_index('date', inplace=True)
    
    return df

# Fetch data
df = fetch_data_from_db()
print(df)
