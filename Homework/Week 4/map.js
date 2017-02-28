

d3.json("https://raw.githubusercontent.com/BerendNannes/DataProcessing/master/Homework/Week%204/globalization.json", function(globalizationData) {
	// json request
	
	stuff = globalizationData[0].globalizationIndex;
	
	var map = new Datamap({
		element: document.getElementById('container'),
		geographyConfig: {
			popupTemplate: function(geo, data) {
				console.log(data.index);
				return ['<div class="hoverinfo">',
				geo.properties.name,
				'</div>'].join('');
				},
			borderColor: 'black',
			borderWidth: 0.5,
		},
		fills: {
			defaultFill: 'white'
		},
		data: stuff
	});
});