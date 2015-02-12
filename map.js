

/*
	hints:
	-implement the line with a google.maps.Polyline
	-let google redraw the polyline (see .getPath()) when a new
	point is added - don't delete the whole thing and add it again 
	-use google.maps.Marker for markers
	-use .setMap(null) do remove/delete either of these from your map
	you're making work for yourself if you do it any other way
*/

var Map = function Map(view) {

	var mapOptions = {
		// feel free to edit map options
		disableDefaultUI: true,
		zoom: 5,
		center: new google.maps.LatLng(39.50, -98.35),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}

	this.init = function() {
		// render map here
		this.map = new google.maps.Map($('#map_canvas')[0], mapOptions);
	}
	this.totalDistance;
	this.points = []; // { lat:0.0, lng:0.0, name: "", time: Date() }
	this.markers = []; // array of markers already on map
	this.polylines = [];

	this.addPoint = function(point) {
		this.points.push({lat: point.lat, lng: point.lng, name: point.name, time: point.time});
		// adds a point to this.points
	}

	this.renderAllPoints = function () {
		var count = 0;
		this.removeData();
		this.points.sort(
			function(a, b) {
				if(a["time"] < b["time"])
					return -1;
				else
					return 1;
			});
		/*for(count = 0; count < this.points.length; ++count) {
			this.renderSinglePoint(this.points[count]);
		}*/
		this.totalDistance = 0;
		var that = this;
		var colors = ['#FF0000', '#0066FF', '#199E19', '#FFFFFF', '#000000', '#FF33CC', '#9933FF', '#FF9900'];
		if(this.points[0]) {
			this.markers.push(new google.maps.Marker({animation: google.maps.Animation.DROP,position: new google.maps.LatLng(this.points[0].lat, this.points[0].lng), map: this.map, title: this.points[0].name}));
			this.renderSinglePoint(0, colors, function(){console.log("ENDED");	view.setMiles(that.totalDistance);});
		}
		
		
		// remove all old map data, *sort* the points
		// and render each point ever ~300ms
		// don't render the point if dist(this_pt,prev) === 0		
	}

	this.removeData = function() {
		// reset distance, clear polypath and markers
		
		this.totalDistance = 0.0;
		var c = 0;
		for(c; c < this.polylines.length; ++c) {
			this.polylines[c].setMap(null);
		}
		for(c = 0; c < this.markers.length; ++c) {
			this.markers[c].setMap(null);
		}
		this.polylines = [];
		this.markers = [];
		//clear polypath
	}

	this.renderSinglePoint = function(current, colors, callback) {
		// render a single point on the map
		// pan the map to the new point
		// make sure to update the polypath
		// consider recursion :)
		var d = 0.0;
		var current_point;
		var random_color = colors[Math.floor(Math.random() * colors.length)];
		var next_point;
		var that = this;
		if(this.points[current + 1]) {
			d = distanceFormula({lat: this.points[current].lat, lng: this.points[current].lng}, {lat: this.points[current + 1].lat, lng: this.points[current + 1].lng});
			if(d > 0){
				current_point = new google.maps.LatLng(this.points[current].lat, this.points[current].lng);
				next_point = new google.maps.LatLng(this.points[current + 1].lat, this.points[current + 1].lng);
				this.totalDistance += d;
				view.setMiles(this.totalDistance);
				this.markers.push(new google.maps.Marker({animation: google.maps.Animation.DROP,position: next_point, map: this.map, title: this.points[current + 1].name}));
				this.polylines.push(new google.maps.Polyline({path: [current_point, next_point], map: this.map, geodesic: true, strokeColor: random_color, strokeOpacity: 1.0, strokeWeight: 2}));

			}
			window.setTimeout(function() {that.renderSinglePoint(current + 1, colors, callback);}, 300);
		} else {
			callback();
		}
	}

	// call the initializer
	this.init();
}
