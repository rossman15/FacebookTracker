
	Number.prototype.toRad = function() {
	    // convert an angle (in degrees) to radians
	    return this * 0.0174532925;
	}

	Number.prototype.prettyPrint = function() {
		// return a string representation of an integer
	    // which has commas every three digits
	    //alert(Number);
	    return (Math.floor(this)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	distanceFormula = function(first, second){
		// compute the distance in miles between two lat lng points
	    // a point should look like {lat: 0.0, lng: 0.0}
	    var R = 3963.1676; // miles
		var lat1 = first.lat.toRad();
		var lat2 = second.lat.toRad();
		var change1 = (second.lat-first.lat).toRad();
		var change2 = (second.lng-first.lng).toRad();

		var a = Math.sin(change1/2) * Math.sin(change1/2) +
				Math.cos(lat1) * Math.cos(lat2) *
				Math.sin(change2/2) * Math.sin(change2/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

		return R * c;
	};
