
$(document).ready(function () {

	/* 
	Notes: 

	all jQuery $("selector") calls should be in this file,
	*don't* add them elsewhere. this will probably be the only
	file making a new Obj() too. if you're confused please
	ask a GSI - but be sure to read the docs first!!!

	show and hide the spinner when anything is loading.
	only show login or logout buttons - not both
	make sure the clear map function stops the current search
	don't let glitchy UI slide - you'll lose points!
	think in terms of callbacks! it will help you fix async problems

	sometimes jquery and bootstrap dont get along, if .hide() and .show()
	don't work right use: addClass("hide") or removeClass("hide")

	Lastly: We will grade everything on the latest version of Chrome,
	so dev with Chrome for gosh sake! Use the dev tools too they're
	amazing!
	*/
	
	
	var map = new Map(this);
	var typeahead = new Typeahead();
	var that = this;
	var fb = new Facebook(map, this, typeahead, function() {
		$("#login_bar .login").hide();
		$("#login_bar .logout").attr('class', 'logout btn btn-default');
		$("#login_bar .logout").show();
		
		// called on successful login
		// set typeahead data and show/hide buttons
		that.hideSpinner();
		map.renderAllPoints();
		
	});
	// create dat spinner
	this.spinner = new Spinner({radius: 30, length: 30}).spin($("#spinner")[0]);
		
	this.setMiles = function(miles) {
		// update #miles_traveled div
		$("#miles_traveled").text(miles.prettyPrint());
	}

	this.setPic = function(user_id) {
		// set the src of the #user_img
		// check out http://graph.facebook.com/ottosipe/picture?type=large
	}


	this.hideSpinner = function() {$("#spinner").attr('class', 'hide');}
	
	this.showSpinner = function() {$("#spinner").attr('class', '');}

    	 
    // attach all of the buttons and key press events below here
    // - .login(click)
	$('#login_bar .login').on('click', function () { fb.login(true); });

    // - .logout(click)
	$('#login_bar .logout').on('click', function () { 
		$("#miles_traveled").text(0);
		$("#user_img").attr('src', "");
		map.removeData();
		map.points = [];
		typeahead.list = [];
		fb.logout();
	});

    // - #user(keyup): use typeahead.search(key, callback)
    // - the call back should render the .drop_items with IDs and Names
    //     - attach a .drop_item(click)
    //     - start the fb search, call fb.search(id)
    //     - reset and clear #search_dropdown
	/*var listMake = function (list) {
	    for (var i = 0; i < list.length; i++) {
	        $("#search_dropdown").append("<div class='drop_item' data-id='"+list[i].id+"'>"+list[i].name+"</div>")
	    }
	}*/

	$("#user").keyup(function () {
	    typeahead.search($("#user").val(), function (list) {
			$("#search_dropdown").attr("class", "well");
			$("#search_dropdown").empty();
			for (var i = 0; i < list.length; i++) {
			    $("#search_dropdown").append("<div url='" + list[i].picture.data.url + "' class='drop_item' data-id='"+list[i].picture.data.url+"'>"+list[i].name+"</div>");
			}
			$(".drop_item").on('click', function() {
				that.setMiles(0);
				$("#search_dropdown").attr("class", "well hide");
				$("#user_img").attr('src', $(this).attr("url"));
			});
		});
	});

    // - .clear(click): remove data and reset miles/image, other UI
	$('.clear').on('click', function () {
		$("#search_dropdown").attr("class", "well hide");
		that.setMiles(map.totalDistance);
		fb.getPicture(false);
	});/////////////
	
	
	


});

