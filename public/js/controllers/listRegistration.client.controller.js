app.controller('registration', function($scope, copy, $state, $location, $cookieStore, $window, api, profilePic, propertyCover, $modal){

    $scope.copy = copy;
    $scope.home = $window.property;
    $scope.user = $window.user;
    $scope.coverPic = propertyCover.getUrl();
    $scope.profilePic = profilePic.getUrl();
    $scope.$state = $state; 
    $scope.changes = [];
    $scope.spinner = {};
    
    var browserLocation = window.location.href;
    
    if(!$scope.home.listingCompleted && typeof $scope.home.changes != 'undefined'){
        for(var i= 0; i<$scope.home.changes.length; i++){
            $scope.changes.push($scope.home.changes[i].section);
        }
        //console.log($scope.changes);
    }
    
    //$scope.gPlace;
    
    if(browserLocation.indexOf('#/') == -1){
        window.location = '#/description';
    }
    
    
    $scope.nextPage = function(page){

        window.location = '#/'+page; 
    }

    $scope.changeStatus = function(status){
        
        var propertyObj = {
             token: $cookieStore.get('token'),
             updates: {status: status},
             section: 'status'
         };

         api.propertyupdate(propertyObj, $scope.home.id).success(function(result){ 
                
                $scope.home = result[1][0];
  

           /* $modal.open({
              templateUrl: 'onHold.html'

            });*/

                  
         }).error(function(err){

            alert(copy.registration.serverError);
 
         }) 
    }
   
    // ------------------------
    // Save or update property
    // ------------------------
    
   $scope.submit = function(property, currentPage, nextPage){
       
        var token = $cookieStore.get('token');
        $scope.spinner[currentPage] = true;
       // ------------------------
       // Log user out if no token
       // ------------------------
       
        if(typeof token == 'undefined'){
            
            browserLocation = browserLocation.substring(browserLocation.indexOf('/property'));
            alert(copy.registration.cookieProblem);
            window.location = '/logout/?redirect='+browserLocation;
        }
         var propertyObj = {
             token: $cookieStore.get('token'),
             updates: property
         };
       
       // ------------------------------
       // Save property if home is empty
       // ------------------------------
         if(typeof $scope.home.id == 'undefined'){
            api.propertyadd(propertyObj).success(function(result){
                //console.log(result);
                $scope.home = result;
                $scope.changes.push(currentPage);
                window.location = 'property/'+result.id+'#/'+nextPage;
                $scope.spinner[currentPage] = false;
                
            }).error(function(err){
                $scope.spinner[currentPage] = false;
                //console.log(err);  
            })
         }else{
        // -----------------------------------
        // Update property if it's existing
        // -----------------------------------
             
             propertyObj.section = currentPage;
             
            api.propertyupdate(propertyObj, $scope.home.id).success(function(result){ 
                
                $scope.home = result[1][0];
                setTimeout(function(){
                   $scope.spinner[currentPage] = false; 
                }, 600);
                
                if($scope.changes.indexOf(currentPage) == -1){
                    $scope.changes.push(currentPage);
                }
                window.location = '#/'+nextPage; 

            }).error(function(err){
                alert(copy.registration.serverError);
                setTimeout(function(){
                   $scope.spinner[currentPage] = false; 
                }, 600);
                //console.log(err);  
            }) 
         }
    }
  
});

app.controller('basic', function($scope, copy){

    $scope.copy = copy;

    var home = $scope.$parent.home;
    $scope.basics = {
        homeInstruction : home.homeInstruction,
        wifiName        : home.wifiName,
        wifiPassword    : home.wifiPassword,
        propertyType    : home.propertyType,
        rentType        : home.rentType,
        capacity        : home.capacity,
        rooms           : home.rooms,
        fullBed         : home.fullBed,
        singleBed       : home.singleBed,
        bath            : home.bath,
        restroom        : home.restroom,
        mattress        : home.mattress
        
    }
    
     
        
});

app.controller('description', function($scope, copy){
    
    $scope.copy = copy;
    var home = $scope.$parent.home;
    
    $scope.description = {
        title          : home.title,
        description    : home.description
    };
});

app.controller('address', function($scope, copy, api){
    $scope.copy = copy;
    var home = $scope.$parent.home;
    
    $scope.address = {
        
        postalCode  : home.postalCode,
        direction   : home.direction,
        address     : home.address,
        region      : home.region,
        city        : home.city,
        state       : home.state,
        lat         : home.lat,
        lng         : home.lng
        
    }
    
    $scope.getLatLong = function(){
        api.latLong($scope.address.region).success(function(result){
            var convert = $.extend({}, result.results);
            //console.log(convert[0].geometry)
            
            $scope.address.lat = convert[0].geometry.location.lat;
            $scope.address.lng = convert[0].geometry.location.lng;
            $scope.address.location = $scope.place;
            
            var locParts = convert[0].formatted_address.split(',');
            $scope.address.state = locParts[0];
            $scope.address.city = locParts[1];

            
        }).error(function(err){
            
        });
    }
    
    
});

app.controller('amenities', function($scope, copy){

    $scope.copy = copy;
    var home = $scope.$parent.home;
   
    $scope.amenities = {
        tv              : home.tv,
        cableTv         : home.cableTv,
        cookingTools    : home.cookingTools,
        dishes          : home.dishes,
        coolingSystem   : home.coolingSystem,
        heatingSystem   : home.heatingSystem,
        internet        : home.internet,
        allDayCheckIn   : home.allDayCheckIn,
        kitchen         : home.kitchen,
        washer          : home.washer,
        bedding         : home.bedding,
        fan             : home.fan,
        gasAirCondition : home.gasAirCondition,
        waterAirCondition : home.waterAirCondition,
        sportEntertainment: home.sportEntertainment,
        bbq             : home.bbq,
        shampoo         : home.shampoo,
        blowDryer       : home.blowDryer,
        hottub          : home.hottub,
        pool            : home.pool,
        fireplace       : home.fireplace,
        iron            : home.iron,
        parking         : home.parking,
        goodForEvents   : home.goodForEvents,
        petAllowed      : home.petAllowed,
        smockingAllowed : home.smockingAllowed,
        wheelchaireAccessible  : home.wheelchaireAccessible
    }
  
});

app.controller('pricing', function($scope, copy){

    $scope.copy = copy;
    var home = $scope.$parent.home;
    
    $scope.price = {
        basePrice       : home.basePrice,
        weeklyDiscount  : home.weeklyDiscount,
        monthlyDiscount : home.monthlyDiscount
    }
});

app.controller('booking', function($scope, copy, api, $state, $cookieStore){

    $scope.copy = copy;
    $scope.overlayNotFrequent = false;
    $scope.overlayFrequent = false;
    
    if($scope.$parent.changes.indexOf('booking') == -1){
        $scope.$parent.submit({}, 'booking', 'booking');
    }

    $scope.booking = {
        frequentRenter :$scope.$parent.home.frequentRenter
    }
    $scope.setInfrequent = function(){

        

        if($scope.$parent.home.frequentRenter == true){
            $scope.overlayNotFrequent = true;
            var availabilityObj = {
                token: $cookieStore.get('token'),
                propertyId: $scope.$parent.home.id
            };

            api.setInfrequent(availabilityObj)
               .success(function(data){
                    $scope.booking.frequentRenter = false;
                    $scope.$parent.home.frequentRenter = false;
                    window.location = '#/calendar'; 
                    $scope.overlayNotFrequent = false;



               }).error(function(err){
                    $scope.overlayNotFrequent = false;
                    alert(copy.registration.serverError);
               })
        }else{
             window.location = '#/calendar'; 
        }
    }


    $scope.setFrequent = function(){

        

        if($scope.$parent.home.frequentRenter == false){
            $scope.overlayFrequent = true;
            var availabilityObj = {
                token: $cookieStore.get('token'),
                propertyId: $scope.$parent.home.id
            };

            api.setFrequent(availabilityObj)
           .success(function(data){
                $scope.booking.frequentRenter = true;
                $scope.$parent.home.frequentRenter = true;
                window.location = '#/calendar'; 
                $scope.overlayFrequent = false;
                
                
           }).error(function(err){
                $scope.overlayFrequent = false;
                alert(copy.registration.serverError);
           })
        }else{
            window.location = '#/calendar'; 
        }
    };
    
});



app.controller('photos', function($scope, copy, api, fileUpload, $cookieStore, propertyCover){
    
    $scope.pictures = [];
    $scope.propertyId = $scope.$parent.home.id;
    
    
    // ----------------------
    // Initial page load
    // ----------------------    
    
    api.propertyPics($scope.propertyId)
        .success(function(data){
            $scope.pictures = data;
  
        }).error(function(err){
            alert(copy.registration.serverError);
        });
    
    // ----------------------
    // removing picture
    // ----------------------
        $scope.removeImage = function(pic){
            //console.log(pic);
            var picObj = {
                pictureId: pic.id,
                token    : $cookieStore.get('token')
            };
            api.propertyPicRemove(picObj)
               .success(function(data){
                    $scope.pictures = $scope.pictures.filter(function( obj ) {
                        return obj.id !== pic.id;
                    });
            }).error(function(error){
                alert(copy.registration.serverError);
            });
        };
  
    // ----------------------
    // removing picture
    // ----------------------
    $scope.saveDescription = function(item){
        //console.log(item.description);
        
        var pictureObj = {
                update   : {description: item.description},
                token    : $cookieStore.get('token'),
                pictureId: item.id
            };
            api.propertyPicUpdate(pictureObj)
               .success(function(data){
                    //console.log(pictureObj);
            }).error(function(error){
                alert(copy.registration.serverError);
            });
    }
    
    // ----------------------
    // change cover picture
    // ----------------------    
    $scope.makeCover = function(pic){
        if(pic.isCover){
            return
        }else{
            var picObj = {
                token: $cookieStore.get('token'),
                data :{
                    propertyId: pic.propertyId,
                    pictureId: pic.id
                }
            }
            
            api.makeCover(picObj)
             .success(function(data){
                 
                for(var i=0; i<$scope.pictures.length; i++){
                    if($scope.pictures[i].isCover == true){
                       $scope.pictures[i].isCover = false; 
                    }
                }
                
                pic.isCover = true;
                
            }).error(function(error){
                alert(copy.registration.serverError);
            });
        }
    }
    
    
     // ----------------------
     // Handeling file upload
     // ----------------------   
    
    
        $scope.fileOverlay = false;
    
        $scope.uploadFile = function(){
            $scope.fileOverlay = true;
            var file = $scope.myFile;
            console.dir(file);
            var uploadUrl = "/upload";


            var fd = new FormData();
            fd.append('file', file);
            fd.append('propertyId', $scope.$parent.home.id);
            fd.append('token', $cookieStore.get('token'));
            if($scope.pictures.length>0){
               fd.append('isCover', false); 
            }else{
               fd.append('isCover', true);  
            }

             var bodyObj = {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}           
             };
            /*fd.append('propertyId', bodyObj.propertyId);
            fd.append('token', bodyObj.token);*/

            api.upload(fd, bodyObj)
                 .success(function(data){
                    document.getElementById("fileSelector").value = "";
                    $scope.fileOverlay = false;
                    $scope.myFile = null;
                    if($scope.pictures.length<1){
                       propertyCover.setUrl($scope.$parent.home.id, data.id);
                       $scope.$parent.changes.push('photos');
                    }
                    //console.log(data);
                    $scope.pictures.push(data);
                }).error(function(error){
                    document.getElementById("fileSelector").value = "";
                    $scope.fileOverlay = false;
                    alert(copy.registration.serverError);
                });

            //fileUpload.uploadFileToUrl(file, uploadUrl, bodyObj)



        };



    
    
    //console.log('here');
    
    /*function upload(file, signed_request, url, done) {
      var xhr = new XMLHttpRequest();
      xhr.open("PUT", signed_request);
      xhr.setRequestHeader('x-amz-acl', 'public-read');
      xhr.onload = function() {
        if (xhr.status === 200) {
          done()
        }
      }

      xhr.send(file);
    }

    function sign_request(file, done) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "/s3sign?file_name=" + file.name + "&file_type=" + file.type +'&folder='+$scope.$parent.home.id);

      xhr.onreadystatechange = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
          var response = JSON.parse(xhr.responseText);
            //console.log(response);
          done(response);
        }
      }

      xhr.send()
    }
    
    $scope.s3Upload = function(elem){
        var file = elem.files[0];
        if (!file) return;
       var fd = new FormData();
        fd.append('file', file);
        var fileHeader =  {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined},
            propertyId:  $scope.$parent.home.id,
            uploadUrl :"/property/"+$scope.$parent.home.id
        };
        
        api.upload(fileHeader, fd ).success(function(result){
            //console.log(result)
        }).error(function(err){
            //console.log(result)
        });
        
        
        //$http.post(uploadUrl, fd, fileHeader);

      sign_request(file, function(response) {
        upload(file, response.signed_request, response.url, function() {
          document.getElementById("preview").src = response.url
        })
      })
    }*/
    
});


//https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY