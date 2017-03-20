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
			// draw map function
			map(RDI);
		})
	}, "https://raw.githubusercontent.com/BerendNannes/DataProcessing/master/Homework/Week%206/Data/RDI.json")
    .defer(function(url, callback) {
		d3.json(url, function(error, data) {
			if (error) throw error;
			// send to pieChart
			clickCallback = function(code, country, index) {
				pieChart(data[0][code], country, index);
			}
		}) 
	}, "https://raw.githubusercontent.com/BerendNannes/DataProcessing/master/Homework/Week%206/Data/religions.json")
    .await(ready);
	
function ready(error) {
    console.log(error.responseText);
}

function pieChart(data, country, index) {
	// draws pie chart

	// remove any existing data
	d3.select("#donut").remove();
	d3.select("#countryText").remove();
	d3.select(".tooltip").remove();
	
	// define div for tooltip
	var div = d3.select("body").append("div")	
		.attr("class", "tooltip")				
		.style("opacity", 0);
	
	var svg = d3.select("#pie"),
		width = +svg.attr("width"),
		height = +svg.attr("height"),
		radius = Math.min(width, height) / 2,
		g = svg.append("g").attr("transform", "translate(" + (radius+20) + "," + height / 2 + ")").attr("id","donut");
	
	var color = d3.scale.ordinal()
		.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "white"]);
	
	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) { return d.percentage; });
	
	var path = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(radius - 60);

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
		.attr("fill", function(d) { return color(d.data.religion); })
		.on("mouseover", function(d) { 
		div.transition()		
			.duration(200)		
			.style("opacity", .9);	
		div.html("<strong>"+d.data.religion+"</strong></br>"+(d.data.percentage*100).toFixed(1)+"%")
			.style("width", radius + "px")
			.style("left", 90 + "px")		
			.style("top", 790 + "px");
		});
		
		
	var countryText = svg.append("text")
		.attr("id","countryText")
		.attr("transform", "translate(280, 30)")
		.attr("fill","black")
	   .append("tspan").html(country)
		.attr("font-size","19")
		.attr("font-weight","bold")
	   .append("tspan").attr("x","0").attr("y","1.3em").html("RDI: " + index)
		.attr("font-size","16")
		.attr("font-weight","normal");
		//.html(country + ": " + index);
		
	var padding = 50,
		legx = 2*radius + padding,
		legend = svg.append("g")
		.attr("class", "legend")
		.attr("transform", "translate(" + legx + ", 90)")
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
		.range(["#efedf5","#4a1486"]);
	
	// set fillColor to data points
	for (var i in dataset) {
		dataset[i].fillColor = paletteScale(dataset[i].index);
	}
	
	var map = new Datamap({
		// create data map
		element: document.getElementById('container'),
		projection: "mercator",
		done: function(datamap) {
				datamap.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
					var code = geo.id;
					clickCallback(code, geo.properties.name, dataset[code].index);
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
			borderWidth: 0.8,
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