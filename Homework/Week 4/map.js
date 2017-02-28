/*
map.js
Data Processing
Berend Nannes
*/

d3.json("https://raw.githubusercontent.com/BerendNannes/DataProcessing/master/Homework/Week%204/globalization.json", function(globalizationData) {
	
	// retrieve json data
	dataset = globalizationData[0];
	
	// get min and max values
	var indexValues = Object.keys(dataset).map(function (key) { return dataset[key].index; } );
	var minIndex = Math.min.apply(null, indexValues);
	var maxIndex = Math.max.apply(null, indexValues);
	
	// create color scale
	var paletteScale = d3.scale.linear()
		.domain([minIndex, maxIndex])
		.range(["#ffe9d8","#7a3501"]);
	
	// set fillColor to data points
	for (var i in dataset) {
		dataset[i].fillColor = paletteScale(dataset[i].index);
	}
	
	// create map
	var map = new Datamap({
		element: document.getElementById('container'),
		projection: "mercator",
		geographyConfig: {
			popupTemplate: function(geo, data) {
				
				// check if there's available data
				if (data) {output = "Globalisation index: " + data.index;}
				else {output = "No data available";}
				
				// return hover info
				return ['<div class="hoverinfo"><strong>',
				geo.properties.name, '</strong></br>' , output,
				'</div>'].join('');
				},
				
			// style properties
			borderColor: 'black',
			borderWidth: 0.5,
			highlightFillColor: 'black',
			highlightBorderColor: 'black',
		},
		// set default fill color
		fills: {
			defaultFill: 'white'
		},
		// set data
		data: dataset
	});
});