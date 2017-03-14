/*
map.js
Data Processing
Berend Nannes
*/

// que json files
d3.queue(2)
    .defer(function(url, callback) {
		d3.json(url, function(error, RDI) {
			if (error) throw error;
			map(RDI);
		})
	}, "https://raw.githubusercontent.com/BerendNannes/DataProcessing/master/Homework/Week%206/Data/RDI.json")
    .defer(function(url, callback) {
		d3.json(url, function(error, data) {
			if (error) throw error;
			clickCallback = function(code) {
				pieChart(data[0][code]);
			}
		}) 
	}, "https://raw.githubusercontent.com/BerendNannes/DataProcessing/master/Homework/Week%206/Data/religions.json")
    .await(ready);
	
function ready(error) {
    console.log(error.responseText);
}

function pieChart(data) {
	if(d3.select("#pie").empty()) {
		console.log("empty");
	};
	
	
	var svg = d3.select("#pie"),
		width = +svg.attr("width"),
		height = +svg.attr("height"),
		radius = Math.min(width, height) / 2,
		g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")").attr("id","pie");
	
	var color = d3.scale.category10();
	
	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) { return d.percentage; });
	
	var path = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(0);

	var label = d3.svg.arc()
		.outerRadius(radius - 40)
		.innerRadius(radius - 40);
	
	var arc = g.selectAll(".arc")
		.data(pie(data))
		.enter().append("g")
		  .attr("class", "arc");
		  
	arc.append("path")
		.attr("d", path)
		.attr("data-legend", function(d) { return d.data.religion; })
		.attr("data-legend-pos", function(d, i) { return i; })
		.attr("fill", function(d) { return color(d.data.religion); });
		
	arc.append("text")
		.attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
		.attr("dy", "0.35em")
		.style("text-anchor", "middle");
		//.text(function(d) { return d.data.religion; });
		
	var padding = 20,
		legx = radius + padding,
		legend = svg.append("g")
		.attr("class", "legend")
		.attr("transform", "translate(" + legx + ", 0)")
		.style("font-size", "12px")
		.call(d3.legend);
	
}

function map(RDI) {
	
	// retrieve json data
	dataset = RDI[0];
	
	// get min and max values
	var indexValues = Object.keys(dataset).map(function (key) { return dataset[key].index; } );
	var minIndex = Math.min.apply(null, indexValues);
	var maxIndex = Math.max.apply(null, indexValues);
	
	// create color scale
	var paletteScale = d3.scale.linear()
		.domain([minIndex, maxIndex])
		.range(["#ffeda0","#f03b20"]);
	
	// set fillColor to data points
	for (var i in dataset) {
		dataset[i].fillColor = paletteScale(dataset[i].index);
	}
	
	// create map
	var map = new Datamap({
		element: document.getElementById('container'),
		projection: "mercator",
		done: function(datamap) {
				datamap.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
					var code = geo.id;
					clickCallback(code);
					});
			},	
		geographyConfig: {
			popupTemplate: function(geo, data) {
				
				// check if there's available data
				if (data) {output = "RDI: " + data.index;}
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
};