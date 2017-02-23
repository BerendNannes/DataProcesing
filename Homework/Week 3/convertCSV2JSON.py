#
# convertCSV2JSON.py
# Berend Nannes
# Data Processing
#

import csv
import json

csv_file = open('BevolkingNL.csv', 'r')
json_file = open('BevolkingNL.json', 'w')

rows = csv.DictReader(csv_file, delimiter=';')

output = json.dumps([i for i in rows])  

json_file.write(output)	
	
csv_file.close()
json_file.close()