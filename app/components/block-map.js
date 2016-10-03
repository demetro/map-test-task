import Ember from 'ember';

var geojson;

export default Ember.Component.extend({
	attributeBindings: ['id'],
	tagName: 'div',
	id: 'map',
	didRender() {
		var _this = this;
		
		var map = L.map(_this.id).setView([37.8, -96], 4);

		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
			id: 'mapbox.light'
		}).addTo(map);
		
		$.getJSON('us-states.js').then(function(data) {
			
			geojson = L.geoJson(data, {
				style: _this.style,
				onEachFeature: function(feature, layer) { _this.onEachFeature(_this, layer); }
			}).addTo(map);

		});

	},
	
	onEachFeature(self, layer) {
		layer.on({
			mouseover: self.highlightFeature,
			mouseout: self.resetHighlight,
			click: self.zoomToFeature
		});
	},
	highlightFeature(el) {
		var layer = el.target;
		
		layer.setStyle({
			weight: 3,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7,
			fillColor: '#ffcc00'
		});

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}
	},
	resetHighlight(e) {
		geojson.resetStyle(e.target);
	},
	zoomToFeature(e) {
		//map.fitBounds(e.target.getBounds());
		var polygon = e.target.feature.properties;
		
		$(".tooltip-body").html('<h4>US Population Density</h4>' +  (polygon ?
				'<b>' + polygon.name + '</b><br>' + polygon.density + ' people / mi<sup>2</sup>'
				: 'Hover over a state'));
		
		$(".tooltip").show();
	},

	style(feature) {
		// get color depending on population density value
		var d = feature.properties.density;

		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '1',
			fillOpacity: 0.6,
			fillColor:  d > 1000 ? '#800026' :
						d > 500  ? '#BD0026' :
						d > 200  ? '#E31A1C' :
						d > 100  ? '#FC4E2A' :
						d > 50   ? '#FD8D3C' :
						d > 20   ? '#FEB24C' :
						d > 10   ? '#FED976' :
								   '#FFEDA0'
		};
	}
});
