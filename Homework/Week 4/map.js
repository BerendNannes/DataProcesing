var map = new Datamap({
	element: document.getElementById('container'),
	geographyConfig: {
		//highlightOnHover: false,
		popupTemplate: function(geo, data) {
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
	data: {
	}
});