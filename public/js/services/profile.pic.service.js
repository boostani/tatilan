app.factory('profilePic', function ($window) {

	var user = $window.user;
	var data = {};
	if(user.pictureUploaded){
		
	    data = {
	        url: "/img/profile/"+user.id+"/"+user.id+"-thumb.jpg"+'?'+new Date().getTime()
	    };
	    
    }else{
	   data = {
	        url: "/img/profile-default.svg"+'?'+new Date().getTime()
	    }; 
    }

    return {
        getUrl: function () {
            return data.url;
        },
        setUrl: function (url) {
            data.url = url;
        }
    };
});


app.factory('propertyCover', function ($window) {
	
	var data = {};

	if($window.property && $window.property.pictures && $window.property.pictures.length!=0){

		var pics = $window.property.pictures;
	
	
		var picObj = pics.filter(function( obj ) {
			return obj.isCover == true;
		});

	
	//if(typeof pics != 'undefined' && picObj.length>0){
	
		
		data.thumb =  "/img/property/"+picObj[0].propertyId+"/"+picObj[0].id+'-thumb.jpg';
		data.large =  "/img/property/"+picObj[0].propertyId+"/"+picObj[0].id+'-large.jpg';
		data.hasPic = true;
		
	}else{
		
		data.thumb =  "/img/default_property.png";
		data.large =  "/img/default_property.svg";
		data.hasPic = false;
	}

    return {
        getUrl: function () {
            return data;
        },
        setUrl: function (propertyId, picId) {
            data.thumb = "/img/property/"+propertyId+"/"+picId+'-thumb.jpg';
            data.large =  "/img/property/"+propertyId+"/"+picId+'-large.jpg';
            data.hasPic = true;
        }
    };
});