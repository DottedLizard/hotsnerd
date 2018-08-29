import psycopg2.extras
import os
import sys
from data_utils import *
import urllib.parse


def print_error(err):

    print('Error: {}'.format(err))
    sys.exit(1)


def open_conn():

    try:

        urllib.parse.uses_netloc.append("postgres")
        url = urllib.parse.urlparse(os.environ["DATABASE_URL"])

        conn = psycopg2.connect(
            database=url.path[1:],
            user=url.username,
            password=url.password,
            host=url.hostname,
            port=url.port
        )

        return conn

    except psycopg2.DatabaseError as e:
        print_error(e)


def close_conn(conn):

    if conn:
        conn.close()


def copy_data(conn, from_table, to_table, clear_to_table):

    try:

        cur = conn.cursor()

        if clear_to_table:
            cur.execute("TRUNCATE " + to_table)

        if isinstance(from_table, str):

            if to_table == "HEROES_ARCHIVE":

                cur.execute("SELECT * FROM " + from_table)
                col_names = [col_name[0] for col_name in cur.description]
                col_names = col_names[1:]
                columns_str = str(tuple(col_names)).replace("'", "")

                results = cur.fetchall()

                for item in results:

                    values = list(item[1:])
                    values[0] = datetime_to_str(values[0])
                    values[2] = datetime_to_str(values[2])

                    query = "INSERT INTO " + to_table + "{} VALUES{}".format(columns_str, tuple(values))
                    cur.execute(query)

            else:

                query = "INSERT INTO " + to_table + " SELECT * FROM " + from_table
                cur.execute(query)

        else:

            for item in from_table:

                columns = item.keys()
                values = [format_num(item[col], col) for col in columns]

                columns_str = str(tuple(columns)).replace("'", "")
                query = "INSERT INTO " + to_table + "{} VALUES{}".format(columns_str, tuple(values))
                cur.execute(query)

        conn.commit()

    except psycopg2.DatabaseError as e:

        if conn:
            conn.rollback()

        print_error(e)

    except IOError as e:

        if conn:
            conn.rollback()

        print_error(e)


def validate_new_data(conn, data):

    try:

        cur = conn.cursor()

        db_patch = None
        db_patch_date = None

        cur.execute("SELECT Patch, Patch_Date FROM HEROES_CURRENT LIMIT 1")
        results = cur.fetchall()

        if results:
            db_patch = results[0][0]
            db_patch_date = str(results[0][1])

        new_patch = data[0]["Patch"]
        new_patch_date = data[0]["Patch_Date"]

        if (db_patch == new_patch) or (db_patch_date == new_patch_date):
            print_error("Database not updated: patch or patch date has not changed.")

    except psycopg2.DatabaseError as e:

        if conn:
            conn.rollback()

        print_error(e)

    except IOError as e:

        if conn:
            conn.rollback()

        print_error(e)
