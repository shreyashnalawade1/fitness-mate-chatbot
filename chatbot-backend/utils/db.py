import psycopg2.pool
import os 

# Database connection information
hostname = os.getenv("PG_HOST")
database = os.getenv("PG_DB")
username = os.getenv("PG_USER")
password = os.getenv("PG_PASSWORD")

# Connection pool configuration
min_conn = 1
max_conn = 10

try:
    # Create a connection pool
    connection_pool = psycopg2.pool.SimpleConnectionPool(
        minconn=min_conn,
        maxconn=max_conn,
        dbname=database,
        user=username,
        password=password,
        host=hostname
    )
    

except (Exception, psycopg2.Error) as error:
    print("Error while connecting to PostgreSQL:", error)