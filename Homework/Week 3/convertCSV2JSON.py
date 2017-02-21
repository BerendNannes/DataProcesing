import csv
import json

csv_file = open('BevolkingNL.csv', 'r')
json_file = open('BevolkingNL.json', 'w')

rows = csv.reader(csv_file, delimiter=";")
next(rows, None)

for i in rows:
	json_file.write(json.dumps({'Leeftijd': i[0] , 'Aantal': i[1]}, sort_keys=True, indent=4, separators=(',', ': ')))
	json_file.write('\n')
	
csv_file.close()
json_file.close()