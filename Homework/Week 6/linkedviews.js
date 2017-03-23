/*
linkedviews.js
Data Processing
Berend Nannes
*/

// set default data
var defaultData = [{
	name: "flare",
	children: [{
		name: "Nonreligious",
		size: 1
	}]
}]			

// standard sunburst
sunBurst(defaultData,"Country",0);

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
			// send to sunBurst
			clickCallback = function(code, country, index) {
				sunBurst(data[0][code], country, index);
			}
		}) 
	}, "https://raw.githubusercontent.com/BerendNannes/DataProcessing/master/Homework/Week%206/Data/religion.json")
    .await(ready);
	
function ready(error) {
    if (error) throw error;
}

// create sunburst visualization
function sunBurst(data, country, index) {
	
	// remove old data
	d3.select("#sun").remove();
	d3.select(".tooltip").remove();
	d3.select("#countryContainer").html("");
	
	// reset mode
	document.getElementById("default").checked = true;

	// define div for tooltip
	var div = d3.select("#burstContainer").append("div")	
		.attr("class", "tooltip")				
		.style("opacity", 0)
		.style("text-align", "center");
	
	// set parameters
	var width = 250,
	height = 200,
	radius = Math.min(width, height) / 2,
	color = d3.scale.ordinal()
		.range(["white", "#4682B4", "#FFD700", "#109615", "#B22222", "#FF8C00", "#eee", "white"]);
	
	// append svg container
	var svg = d3.select("#burstContainer").append("svg")
		.attr("id","sun")
		.attr("width", width)
		.attr("height", height)
	  .append("g")
		.attr("transform", "translate(0" + (radius+20) + "," + height * .5 + ")");
	
	// define partitions
	var partition = d3.layout.partition()
		.sort(null)
		.size([2 * Math.PI, radius * radius])
		.value(function(d) {return d.size; });
	
	var arc = d3.svg.arc()
		.startAngle(function(d) { return d.x; })
		.endAngle(function(d) { return d.x + d.dx; })
		.innerRadius(function(d) { return Math.sqrt(d.y); })
		.outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });
	
	// return standard if no data
	if(typeof data === "undefined") {
		data = defaultData;
		country = "No data available";
		index = 0;
	};
	
	// draw sunburst
	var path = svg.datum(data[0]).selectAll("path")
	.data(partition.nodes)
  .enter().append("path")
	.attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
	.attr("d", arc)
	.attr("class","part")
	.style("fill", function(d) { return color(((d.children || (d.depth < 2)) ? d : d.parent).name); })
	.style("fill-rule", "evenodd")
	.each(stash)
	// add mouseover functionality
	.on("mouseover", function(d) {
		div.transition()		
			.duration(200)		
			.style("opacity", .9);	
		div.html("<b>" + formatNumber(d.total) + "</b><br/>" + ((d.parent && (d.depth > 1)) ? (d.parent.name + "<br/>") : "") + d.name + "<br/>")
			.style("width", radius + "px")
			.style("left", 820 + "px")		
			.style("top", 360 + "px");
		});	
	
	// add country info
	var countryText = d3.select("#countryContainer")
	   .append("span")
		.style("font-size","25px")
		.style("font-weight","bold")
		.html(country+"<br/>")
	   .append("span")
		.style("font-size","20px")
		.style("font-weight","normal")
		.style("align","right")
		.html("RDI: " + index);

	// change view
	d3.selectAll("input").on("change", function change() {
	  var value = this.value === "count"
		? function() { return 1; }
		: function(d) { return d.size; };

	  path
		.data(partition.value(value).nodes)
       .transition()
		.duration(1500)
		.attrTween("d", arcTween);
	

	// Interpolate the arcs in data space.
	function arcTween(a) {
		  var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
		  return function(t) {
				var b = i(t);
				a.x0 = b.x;
				a.dx0 = b.dx;
				return arc(b);
	  };
}

d3.select(self.frameElement).style("height", height + "px");
  });
}

// create data map
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
		.range(["#efedf5","#4d4675"]);
	
	// set fillColor to data points
	for (var i in dataset) {
		dataset[i].fillColor = paletteScale(dataset[i].index);
	}
	
	var map = new Datamap({
		// create data map
		element: document.getElementById('mapContainer'),
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
			borderWidth: 0.6,
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

// Stash the old values for transition.
function stash(d) {
	d.total = d.value;
	d.x0 = d.x;
	d.dx0 = d.dx;
}

// format big numbers
function formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
