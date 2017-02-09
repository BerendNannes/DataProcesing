#!/usr/bin/env python
# Name: Berend Nannes
# Student number: 10382976

'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):

	'''
	Extract a list of highest rated TV series from DOM (of IMDB page).
	'''

	# create list of tv series
	series = []
	
	for e in dom.by_tag("div.lister-item-content")[:50]: # top 50 entries
	
		# create dict with tv series data
		data = {}
		
		# get series title
		data['Title'] = (e.by_tag("a")[0].content).encode('ascii','ignore')
		
		# get rating
		data['Rating'] = e.by_tag("strong")[0].content
		
		# get genre
		data['Genre'] = ((e.by_tag("span.genre")[0].content[1:])).rstrip().encode('ascii','ignore')
		
		# get all actors
		stars = ""
		for name in(e.by_tag("p")[-2]).by_tag("a"):
			stars += name.content + ", "
		data['Actors'] = stars[:-2].encode('ascii','ignore')
		
		# get runtime
		data['Runtime'] = e.by_tag("span.runtime")[0].content

		# add data to tv series list
		series.append(data)
		
	return series  # return list of series


def save_csv(f, tvseries):
	'''
	Output a CSV file containing highest rated TV-series.
	'''
	writer = csv.writer(f)
	writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])
	
	for serie in tvseries:
		writer.writerow([serie['Title'], serie['Rating'], serie['Genre'], serie['Actors'], serie['Runtime']])


if __name__ == '__main__':
	# Download the HTML file
	url = URL(TARGET_URL)
	html = url.download()

	# Save a copy to disk in the current directory, this serves as an backup
	# of the original HTML, will be used in grading.
	with open(BACKUP_HTML, 'wb') as f:
		f.write(html)

	# Parse the HTML file into a DOM representation
	dom = DOM(html)

	# Extract the tv series (using the function you implemented)
	tvseries = extract_tvseries(dom)

	# Write the CSV file to disk (including a header)
	with open(OUTPUT_CSV, 'wb') as output_file:
		save_csv(output_file, tvseries)