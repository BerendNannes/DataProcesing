/*
multiline.js
Berend Nannes
Data Processing
*/

// set size and margins
var svg = d3.select("svg"),
    margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;

// convert to js date	
var parseTime = d3.timeParse("%Y%m%d");

// define div for tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

// que json files
d3.queue(2)
    .defer(function(url, callback) {
		d3.json(url, function(error, data) {
			if (error) throw error;
			callback2015(data);
		})
	}, "https://raw.githubusercontent.com/BerendNannes/DataProcessing/master/Homework/Week%205/Data/rain2015.json")
    .defer(function(url, callback) {
		d3.json(url, function(error, data) {
			if (error) throw error;
			callback2016(data);
		}) 
	}, "https://raw.githubusercontent.com/BerendNannes/DataProcessing/master/Homework/Week%205/Data/rain2016.json")
    .await(ready);
	
function ready(error) {
    console.log(error.responseText);
}

// callback for 2015 data
function callback2015(data) {
	d3.select("#twenty-fifteen")
		.on("click", function(){
			d3.select("g").remove();
			draw(data);
			});
}

// callback for 2016 data
function callback2016(data) {
	d3.select("#twenty-sixteen")
		.on("click", function(){
			d3.select("g").remove();
			draw(data);
			});
}
	

function draw(data) {
	
	// add graph container
	var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	// set scales
	var x = d3.scaleTime().range([0, width]),
		y = d3.scaleLinear().range([height, 0]),
		z = d3.scaleOrdinal(d3.schemeCategory10);
		
	// define line
	var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.rainfall); });
	
	// convert dates
	data.forEach(function(d){
		if (!(d.Date instanceof Date)) {d.Date = parseTime(d.Date);}	
		for (var i in d.Rainfall) {
			d.Rainfall[i] = +d.Rainfall[i];
		}
	});
	
	// get data for each station
	var stations = [];
	for (var station in data[0].Rainfall) {
		var info = {
			id: station,
			values: data.map(function(d) {
				return {date: d.Date, rainfall: d.Rainfall[station]};
			})
		}			
		stations.push(info);	
	};
	
	
	// set x,y,z domain
	x.domain(d3.extent(data, function(d) { return d.Date; }));
	
	y.domain([
		d3.min(stations, function(c) { return d3.min(c.values, function(d) { return d.rainfall; }); }),
		d3.max(stations, function(c) { return d3.max(c.values, function(d) { return d.rainfall; }); })
	]);
	
	z.domain(stations.map(function(c) { return c.id; }));
	
	// set x-axis
	g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));
	
	// set y-axis
	g.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(y))
	   .append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("fill", "#000")
		.text("Rainfall, (0.1 mm)");
	
	// add data
	var station = g.selectAll(".station")
	   .data(stations)
	   .enter().append("g")
		.attr("class", "station");
		
	// draw path
	station.append("path")
		.attr("class", "line")
		.attr("d", function(d) { return line(d.values); })
		.style("stroke", function(d) { return z(d.id); });
	
	// define focus line
	var focus = station.append('g').style('display', 'none');
	
	focus.append('line')
		.attr('id', 'focusLineY')
		.attr('class', 'focusLine');
	focus.append('circle')
		.attr('id', 'focusCircle')
		.attr('r', 3)
		.attr('class', 'circle focusCircle');
	focus.append('rect')
		
	var bisectDate = d3.bisector(function(d) { return d.Date; }).left;

	g.append('rect')
		.attr('class', 'overlay')
		.attr('width', width)
		.attr('height', height)
		.on('mouseover', function() { focus.style('display', null); })
		.on('mouseout', function() { focus.style('display', 'none'); })
		.on('mousemove', function() { 
			var mouse = d3.mouse(this); // current mouse position
			var mouseDate = x.invert(mouse[0]);
			var i = bisectDate(data, mouseDate); // returns the index to the current data item

			// coordinates for focus line
			var x1 = x(data[i].Date);
			var y2 = height;

			// draw focus circle/line
			focus.select('#focusCircle')
				.attr('cx', x1)
				.attr('cy', y2);
			focus.select('#focusLineY')
				.attr('x1', x1).attr('y1', y2)
				.attr('x2', x1).attr('y2', 0);
				
			div.transition()		
				.duration(200)		
				.style("opacity", .9);		
			div.html("<strong>" + String(data[i].Date).substring(4, 11) + "</strong></br>" +
					"<p style='color:rgb(22,118,182)'>" + "De Bilt: "+ (data[i].Rainfall["De Bilt"])/10 + " mm</br></p>" +
					"<p style='color:rgb(255,127,0)'>" +"Leeuwarden: "+ (data[i].Rainfall["Leeuwarden"])/10 + " mm</br></p>" +
					"<p style='color:rgb(36,161,34)'>" +"Maastricht: " + (data[i].Rainfall["Maastricht"])/10  + " mm</p>")
				.style("left", x1 + margin.left + 20 + "px")		
				.style("top", margin.top + 40 + "px");
				
			console.log(data[i]);
		});
		
};