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

d3.json("https://raw.githubusercontent.com/BerendNannes/DataProcessing/master/Homework/Week%205/Data/rain2015.json", function(error, data) {
	if (error) throw error;
	
	// convert dates
	data.forEach(function(d){
	d.Date = parseTime(d.Date);
	});
	
	for (var i in data) {
		//console.log(data[i])
	};
	
	var arr = data.map(function(d) {
        return {bilt: d.Rainfall["De Bilt"]};
    })
	console.log(arr);
	
	x.domain(d3.extent(data, function(d) { return d.date; }));

});