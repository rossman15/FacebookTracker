
var Facebook = function(map, view, typeahead, callback) {
	this.login = function() {
		console.log("enter login");	// login a user and call callback() if successfull
		// be sure to provide appropriate {scopes: "scopes,go,here"}
		that = this;
		FB.login(function (response) {
			if(response.authResponse) {
				view.showSpinner();
				FB.api(	"/me/photos?fields=place.fields(location.fields(latitude, longitude), name)&limit=1000",
					function (response) {
						if (response && !response.error) {
							that.passToMap(response, "photos");
							FB.api(	"/me/statuses?fields=place.fields(location.fields(latitude, longitude), name)&limit=1000",
								function (response) {
									if (response && !response.error) {
										that.passToMap(response, "statuses");
										FB.api(	"/me/taggable_friends?fields=name, picture&limit=1000",
											function (response) {
												if (response && !response.error) {
													typeahead.setDataList(response.data);
													that.getPicture(true);
												}
											}
										);	
										
									}
								}
							);
						}
					}
				);
			}
		}, {scope: 'user_status, user_photos, user_friends, public_profile'});
	}

	this.logout = function() {
		console.log("logout()");
		map.removeData();
		map.points = [];
		FB.logout();
		$("#login_bar .logout").hide();
		$("#login_bar .login").show();
		// log the user out, remember the buttons!
	}

	this.getPicture = function(condition) {
		FB.api(	"/me/picture?type=large",
			function (response) {
				if (response && !response.error) {
						$("#user_img").attr('src', response.data.url);
						if(condition) {
							callback();
						}
				}
			}
		);
		// return a list of the user and user's friends as 
		// an argument to cb, be sure to add the logged 
		// in fb user too! 
		// returns somethin like cb([{name:"",id:""},...]);
	}


	this.passToMap = function(response, type) {
		console.log("passToMap() length: " + response["data"].length + " " + type);
		var count = 0;
		for(count = 0; count < response["data"].length; ++count) {
			if(response["data"][count]["place"]) {
				if(type == "photos") {
					map.addPoint({lat: response["data"][count]["place"]["location"]["latitude"], 
					lng: response["data"][count]["place"]["location"]["longitude"], 
					name: response["data"][count]["place"]["name"], 
					time: new Date(response["data"][count]["created_time"])});
				} else {
					map.addPoint({lat: response["data"][count]["place"]["location"]["latitude"], 
					lng: response["data"][count]["place"]["location"]["longitude"], 
					name: response["data"][count]["place"]["name"], 
					time: new Date(response["data"][count]["updated_time"])});
				}
			}
		}
		// helper function for the search
		// pulls out anything with a place
		// call map.addPoint(point)
		// be sure to make the time: new Date("time_string")
	}
	this.init = function() {

		/* provided FB init code, don't need to touch much at all*/
		console.log("init()");
		var that = this; // note this usefull trick!
		window.fbAsyncInit = function() {
	
			// init the FB JS SDK
			FB.init({
				appId      : '583532415107080',	// App ID from the app dashboard
				channelUrl : '/channel.html', 	// Channel file for x-domain comms
				status     : true,
				xfbml      : true,
				version    : 'v2.0',
				cookie     : true,
				oauth      : true
			});

			FB.getLoginStatus(function(response) {
				if (response.status === 'connected') {
					console.log("connected");
					// the user is logged in and has authenticated
					//that.login(false);
					that.login();
				} else if (response.status === 'not_authorized') {
					// the user is logged in to Facebook, 
					console.log("not authorized");
					that.login();
					// but has not authenticated your app
				} else {
					// the user isn't logged in to Facebook.
					//alert("NOT LOGGED IN");
					console.log("not connected");
					that.login();
				}
			});
		};

		// Load the SDK asynchronously - ignore this Magic!
		(function(d, s, id){
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {return;}
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/en_US/all.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	}	

	this.init();
}


