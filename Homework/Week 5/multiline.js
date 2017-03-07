/*
multiline.js
Berend Nannes
Data Processing
*/

var svg = d3.select("svg"),
    margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
var parseTime = d3.timeParse("%Y%m%d");

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);
	
var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.rainfall); });

d3.json("https://raw.githubusercontent.com/BerendNannes/DataProcessing/master/Homework/Week%205/Data/rain2015.json", function(error, data) {
	if (error) throw error;
	
	// convert dates
	data.forEach(function(d){
		d.Date = parseTime(d.Date);
		for (var i in d.Rainfall) {
			d.Rainfall[i] = +d.Rainfall[i];
		}
	});
	
	
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
	
	console.log(stations);
	
	x.domain(d3.extent(data, function(d) { return d.date; }));
	
	y.domain([
		d3.min(stations, function(c) { return d3.min(c.values, function(d) { return d.rainfall; }); }),
		d3.max(stations, function(c) { return d3.max(c.values, function(d) { return d.rainfall; }); })
	]);
	
	z.domain(stations.map(function(c) { return c.id; }));
	
	g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));
	
	g.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(y))
	   .append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("fill", "#000")
		.text("Rainfall, mm");
	
	var station = g.selectAll(".station")
	   .data(stations)
	   .enter().append("g")
		.attr("class", "station");
		
	
	station.append("path")
		.attr("class", "line")
		.attr("d", function(d) { return line(d.values); })
		.style("stroke", function(d) { return z(d.id); });
	/*	
	station.append("text")
		.datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
		.attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.rainfall) + ")"; })
		.attr("x", 3)
		.attr("dy", "0.35em")
		.style("font", "10px sans-serif")
		.text(function(d) { return d.id; });
	*/
});