import collections
from datetime import *


format_num_map = {
    "DPS": 1,
    "AA_Dmg": 1,
    "AA_Speed": 2,
    "AA_Range": 1,
    "HP": 0,
    "HP_Regen": 1,
    "Mana": 0,
    "Mana_Regen": 1,
    "Spell_Power": 0,
    "Physical_Armor": 0,
    "Spell_Armor": 0,
    "Move_Speed": 1,
    "HP_Scaling": 4,
    "HP_Regen_Scaling": 4,
    "Mana_Scaling": 4,
    "Mana_Regen_Scaling": 4,
    "AA_Dmg_Scaling": 4
}


def read_csv(input_file):

    with open(input_file, 'r') as file:

        first_line = file.readline()
        header = first_line.strip().split(",")
        contents = []

        for line in file:

            data = line.strip().split(",")
            contents.append(create_dict(header, data))

    return contents


def create_dict(keys, values):

    today = datetime_to_str(datetime.today())

    new_dict = collections.OrderedDict()
    new_dict["Post_Date"] = today

    for i in range(0, len(keys)):
        new_dict[keys[i]] = values[i]

    return new_dict


def datetime_to_str(dt):
    return str(dt.year) + "-" + str(dt.month).zfill(2) + "-" + str(dt.day).zfill(2)


def write_txt(file_path, data):

    txt_file = open(file_path, 'wt', newline='\n')

    if isinstance(data, dict):

        txt_file.write("\t".join(data.keys()))

        for key in data:
            txt_file.write("\t".join(data[key]))

    elif isinstance(data, list):

        txt_file.write("\t".join(data[0].keys()) + "\r\n")

        for item in data:
            txt_file.write("\t".join(item.values()) + "\r\n")

    else:
        txt_file.write(data)

    txt_file.close()


def convert_to_json(file_path, data):

    json = "[\r\n"

    i = 0

    for item in data:

        i += 1

        json += "\t{\r\n"

        j = 0

        for pair in item.items():

            j += 1

            json += "\t\t" + "\"" + str(pair[0]) + "\"" + ": "
            json += "\"" + str(pair[1]) + "\""

            if j != len(item.items()):
                json += ","

            json += "\r\n"

        json += "\t}"

        if i != len(data):
            json += ","

        json += "\r\n"

    json += "]"

    write_txt(file_path, json)

    return json


def is_float(value):

    try:
        float(value)
        return True

    except ValueError:
        return False


def format_num(value, header):

    if is_float(value):
        return ("{:." + str(format_num_map[header]) + "f}").format(float(value))
    else:
        return value
