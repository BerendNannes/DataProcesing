//d3.json("http://raw.githubusercontent.com/BerendNannes/DataProcessing/master/Homework/Week%203/BevolkingNL.json", function(data) {
//  console.log(data);
//});

var margin = {top: 20, right: 30, bottom: 60, left: 100},
    width = 1080 - margin.left - margin.right,
    height = 720 - margin.top - margin.bottom;
	
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);
	
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("http://raw.githubusercontent.com/BerendNannes/DataProcessing/master/Homework/Week%203/BevolkingNL.json", function(data) {
	
	data.forEach(function(d){
	d.Aantal = +d.Aantal;
	});
	
	console.log(data[0]);
	
	x.domain(data.map(function(d) { return d.Leeftijd; }));
	y.domain([0, d3.max(data, function(d) { return d.Aantal; })]);
	
	chart.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis)
	.append("text")
       .attr("x", width + 30)
	   .attr("y", 40)
       .style("text-anchor", "end")
       .text("Leeftijd")
	 .selectAll("text")
       .attr("y", 0)
       .attr("x", 9)
       .attr("dy", ".71em")
       .attr("transform", "rotate(45)")
       .style("text-anchor", "start");


	chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
     .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Aantal inwoners");

	var barWidth = width / data.length;

	var bar = chart.selectAll(".bar")
      .data(data)
     .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

	bar.append("rect")
	 .attr("class", "bar")
      .attr("y", function(d) { return y(d.Aantal); })
      .attr("height", function(d) { return height - y(d.Aantal); })
      .attr("width", barWidth - 1);

	//bar.append("text")
     // .attr("x", barWidth / 2)
     // .attr("y", function(d) { return y(d.Aantal) + 3; })
     // .attr("dy", ".75em")
     // .text(function(d) { return d.Aantal; });
	  
});




