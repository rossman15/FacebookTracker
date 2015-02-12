var Typeahead = function Typeahead() {

    this.list = []; // list of objects like: { name:"", id:"" }

    data = [{ name: "Brandon", id: "123" }, { name: "Ross", id: "456" }];

	this.setDataList = function (data) {
		// set the list to a list of name,id pairs
	    // then sort it by fullname A-Z 
	    this.list = data;
	    //console.log(data[345].name);
	    //console.log(data[0].picture.url);
	    this.list.sort(
			function(a, b) {
				if(a["name"] < b["name"])
					return -1;
				else
					return 1;
		});
	}


    this.search = function (key, cb) {
        //console.log(this.list);
        // given a key, make it lowercase
        var myKey = key.toLowerCase();
        var returnPairs = [];

        // seperate it into an array of distinct words by spaces and 
        myKey = myKey.split(" ");

		
        // compare it to the lowercase version of each name
        var curName;
        
	        for (var j = 0; j < this.list.length; j++) {
	        	var search1_user1 = false;
	        	var search1_user2 = false;
	        	var search2_user1 = false;
	        	var search2_user2 = false;
	        	for (var i = 0; i < myKey.length; i++) {
			        curName = this.list[j].name.split(" ");
			        for (var m = 0; m < curName.length; m++) {
			            curName[m] = curName[m].toLowerCase();
			            match = true;
			            for(var x = 0; x < myKey[i].length; ++x) {
				        	if (myKey[i][x] !== curName[m][x]) {
				        		match = false;
				        	}
					    }
					    if(match) {
							if(i === 0) {
				    			if(m === 0) {
				    				search1_user1 = true;
				    			}else {
				    				search1_user2 = true;
				    			}
				    		}else {
				    			if(m === 0) {
				    				search2_user1 = true;
				    			}else {
				    				search2_user2 = true;
				    			}
				    		}
		        		}
					    
			        }
			        
	        	}	
	        	if(myKey.length == 2) {
	        		if(search1_user1) {
	        			if(search2_user2) {
	        				returnPairs.push(this.list[j]);
	        			}
					}
					if(search1_user2) {
	        			if(search2_user1) {
	        				returnPairs.push(this.list[j]);
	        			}
					}
	        	}
	        	if(myKey.length == 1) {
	        		if(search1_user1) {
	        			returnPairs.push(this.list[j]);
					}
					if(search1_user2) {
	        				returnPairs.push(this.list[j]);
					}
	        	}
        }
        cb(returnPairs);
    }
}
