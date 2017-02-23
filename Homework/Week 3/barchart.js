/*
barchart.js
Berend Nannes
Data Processing
*/

// Set scales and margins
var margin = {top: 80, right: 30, bottom: 60, left: 100},
    width = 1080 - margin.left - margin.right,
    height = 760 - margin.top - margin.bottom;
	
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);
	
// setup axes
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// edit title element
var title = d3.select(".title")
		.html("Bevolkingsopbouw van Nederland in 2016")
		.style("left", width/2 - 2*margin.left + "px")

// select svg.chart element
var chart = d3.select(".chart")
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
     .append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
// Define div for tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

d3.json("http://raw.githubusercontent.com/BerendNannes/DataProcessing/master/Homework/Week%203/BevolkingNL.json", function(data) {
	
	// convert data to numbers
	data.forEach(function(d){
	d.Aantal = +d.Aantal;
	});

	// set x and y domain
	x.domain(data.map(function(d) { return d.Leeftijd; }));
	y.domain([0, d3.max(data, function(d) { return d.Aantal; })]);
	
	// x-axis
	chart.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis)
	 .append("text")
       .attr("x", width + 10)
	   .attr("y", 40)
       .style("text-anchor", "end")
	   .style("font-size", "14px")
       .text("Leeftijd (j)");

	// y-axis
	chart.append("g")
       .attr("class", "y axis")
       .call(yAxis)
     .append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 6)
       .attr("dy", ".71em")
       .style("text-anchor", "end")
	   .style("font-size", "14px")
       .text("Aantal inwoners");
	  
	 // set bar width
	var barWidth = width / data.length;

	// place bar containers
	var bar = chart.selectAll(".bar")
      .data(data)
     .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

	// draw bars
	bar.append("rect")
	 .attr("class", "bar")
      .attr("y", function(d) { return y(d.Aantal); })
      .attr("height", function(d) { return height - y(d.Aantal); })
      .attr("width", barWidth - 2)
	  // ad tooltip functionality
	  .on("mouseover", function(d, i) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div.html(d.Aantal)	
                .style("left", (i * barWidth + margin.left + 8) + "px")		
                .style("top", y(d.Aantal) + margin.top - 10 + "px");	
            })					
       .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        }); 
});




