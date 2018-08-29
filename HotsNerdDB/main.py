from db_utils import *
from data_utils import *
import shutil

input_file = "hero_input_prime.csv"

conn = open_conn()

cur = conn.cursor()
cur.execute("SELECT COUNT(*) FROM HEROES_CURRENT")
print("CURRENT: " + str(cur.fetchall()))
cur.execute("SELECT COUNT(*) FROM HEROES_PRIOR")
print("PRIOR: " + str(cur.fetchall()))
cur.execute("SELECT COUNT(*) FROM HEROES_ARCHIVE")
print("ARCHIVE: " + str(cur.fetchall()))

current_data = read_csv(input_file)
validate_new_data(conn, current_data)

json_path = "../javascript/json/current_data.json"
shutil.copy(json_path, "../javascript/json/prior_data.json")
convert_to_json(json_path, current_data)

copy_data(conn, "HEROES_PRIOR", "HEROES_ARCHIVE", False)
copy_data(conn, "HEROES_CURRENT", "HEROES_PRIOR", True)
copy_data(conn, current_data, "HEROES_CURRENT", True)

close_conn(conn)

print("DB updated successfully!")
