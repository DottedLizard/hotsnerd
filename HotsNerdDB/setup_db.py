import psycopg2.extras
import os
import sys
import urllib.parse

conn = None


def print_error(err):

    if conn:
        conn.rollback()

    print('Error: {}'.format(err))
    sys.exit(1)


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
    
    cur = conn.cursor()
    cur.execute("SELECT version()")
    ver = cur.fetchone()
    print(ver)

    cur.execute("DROP TABLE IF EXISTS HEROES_CURRENT")
    cur.execute("DROP TABLE IF EXISTS HEROES_PRIOR")
    cur.execute("DROP TABLE IF EXISTS HEROES_ARCHIVE")

    cur.execute("CREATE TABLE HEROES_CURRENT(Id SERIAL PRIMARY KEY, Post_Date DATE, Patch TEXT, " +
                "Patch_Date DATE, Hero TEXT, Image TEXT, Role TEXT, DPS TEXT, AA_Dmg TEXT, " +
                "AA_Speed TEXT, AA_Range TEXT, HP TEXT, HP_Regen TEXT, Mana TEXT, Mana_Regen TEXT, " +
                "Spell_Power TEXT, Spell_Armor TEXT, Physical_Armor TEXT, Move_Speed TEXT, " +
                "HP_Scaling TEXT, HP_Regen_Scaling TEXT, Mana_Scaling TEXT, " +
                "Mana_Regen_Scaling TEXT, AA_Dmg_Scaling TEXT)")

    cur.execute("CREATE TABLE HEROES_PRIOR(Id SERIAL PRIMARY KEY, Post_Date DATE, Patch TEXT, " +
                "Patch_Date DATE, Hero TEXT, Image TEXT, Role TEXT, DPS TEXT, AA_Dmg TEXT, " +
                "AA_Speed TEXT, AA_Range TEXT, HP TEXT, HP_Regen TEXT, Mana TEXT, Mana_Regen TEXT, " +
                "Spell_Power TEXT, Spell_Armor TEXT, Physical_Armor TEXT, Move_Speed TEXT, " +
                "HP_Scaling TEXT, HP_Regen_Scaling TEXT, Mana_Scaling TEXT, " +
                "Mana_Regen_Scaling TEXT, AA_Dmg_Scaling TEXT)")

    cur.execute("CREATE TABLE HEROES_ARCHIVE(Id SERIAL PRIMARY KEY, Post_Date DATE, Patch TEXT, " +
                "Patch_Date DATE, Hero TEXT, Image TEXT, Role TEXT, DPS TEXT, AA_Dmg TEXT, " +
                "AA_Speed TEXT, AA_Range TEXT, HP TEXT, HP_Regen TEXT, Mana TEXT, Mana_Regen TEXT, " +
                "Spell_Power TEXT, Spell_Armor TEXT, Physical_Armor TEXT, Move_Speed TEXT, " +
                "HP_Scaling TEXT, HP_Regen_Scaling TEXT, Mana_Scaling TEXT, " +
                "Mana_Regen_Scaling TEXT, AA_Dmg_Scaling TEXT)")

    conn.commit()

except psycopg2.DatabaseError as e:
    print_error(e)

except IOError as e:
    print_error(e)

finally:

    if conn:
        conn.close()
