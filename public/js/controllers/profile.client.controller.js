app.controller('profile', function($scope, copy, api, $cookieStore, $state){
    
    if($state.current.name == 'profile'){
       $state.go('profile.edit')
        
    }

});

app.controller('password', function($scope, copy, api, $cookieStore, $state){
    
    var token           = $cookieStore.get('token');
    var re              = new RegExp("^([a-z0-9@*#]{8,15})$");
    $scope.errorMessage = false,
    $scope.noMatch      = false;
    $scope.wrongPass    = false;

    
    $scope.passwordCriteria = function(){
        if(!re.test($scope.password.new)){
            $scope.wrongPass = true;
        }else{
            $scope.wrongPass = false;
        }
    }
    
    $scope.chekPassword = function(){
        if($scope.password.new != $scope.passwordConfirm && $scope.password.new != '' && $scope.passwordConfirm != ''){
           $scope.noMatch = true; 
        }else{
            $scope.noMatch = false;
        }
    }
    

});

app.controller('profileEdit', function($scope, copy, api, $cookieStore, $state, profilePic, $window){
    
    $scope.copy = copy; 
    
    var token = $cookieStore.get('token');
    var browserLocation = window.location.href;
    $scope.years = [];
    $scope.user = $window.user;
    $scope.newPhone = {};
    $scope.phoneError = false;
    $scope.verifyError = false;
    $scope.verificationFailed = false;
    $scope.verify = '';
    var date = new Date();
    date = date.toPersianDate();
    
    for(var i= date.yr; i> 1319; i--){
        $scope.years.push(i);   
    }

    $scope.profilePic = profilePic.getUrl();    

    $scope.$watch(function () { return profilePic.getUrl(); }, function (newValue, oldValue) {      
        if (newValue !== oldValue) $scope.profilePic  = newValue;        
    });


    // ---------------------------
    // upload profile picture
    // ---------------------------
    $scope.fileOverlay = false;
    
    $scope.uploadFile = function(){
            $scope.fileOverlay = true;
            var file = $scope.myFile;
            console.dir(file);


            var fd = new FormData();
            fd.append('file', file);
            fd.append('token', $cookieStore.get('token'));


             var bodyObj = {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}           
             };


            api.profilePic(fd, bodyObj)
                 .success(function(data){
                    document.getElementById("fileSelector").value = "";
                    $scope.fileOverlay = false;
                    $scope.myFile = null;
                    profilePic.setUrl("/img/profile/"+user.id+"/"+user.id+"-thumb.jpg?version="+new Date());


                }).error(function(error){
                    document.getElementById("fileSelector").value = "";
                    $scope.fileOverlay = false;
                    alert(copy.registration.serverError);
                });




        };
       
       // ------------------------
       // Log user out if no token
       // ------------------------
       
        if(typeof token == 'undefined'){
            
            browserLocation = browserLocation.substring(browserLocation.indexOf('/in'));
            alert(copy.registration.cookieProblem);
            window.location = '/logout/?redirect='+browserLocation;
        }
    
    // ---------------------------------------------
    // Initial call to get the profile data
    // ---------------------------------------------         
    
    api.getProfile({token: $cookieStore.get('token')})
        .success(function(result){
            $scope.profile = result;
            var dob = new Date($scope.profile.dob);
            $scope.profile.dob = dob.toPersianDate();
            //console.log( $scope.profile);
            $scope.profile.gender="Male";
    }).error(function(err){
         alert(copy.registration.serverError);
        
    });
    
    // ---------------------------------------------
    // Check if phone number is unique
    // ---------------------------------------------
    $scope.checkPhoneNumber = function(phoneNumber){
        //console.log(phoneNumber);
        api.phoneIsUnique(phoneNumber)
           .success(function(data){
                if(!data.unique){
                    $scope.phoneError = true;
                }else{
                    $scope.phoneError = false;
                }
                //console.log(data);
        }).error(function(err){
            alert(copy.registration.serverError);
        })
    };
    
    // ---------------------------------------------
    // add Phone Number
    // ---------------------------------------------
    
    $scope.addPhone = function(phoneNumber){
        var phoneObj = {
            data: phoneNumber,
            token: token
        }
        api.phoneAdd(phoneObj)
            .success(function(data){

                $scope.addPhonePage = false;
                $scope.newPhone = data;
				$scope.phoneIndex = $scope.profile.phones.length;
                $scope.profile.phones.push($scope.newPhone);
                
            
            }).error(function(err){
                alert(copy.registration.serverError);
            })
    }
    
    $scope.openVerification = function(index){
	    
	    $scope.addPhonePage = false;
	    $scope.phoneIndex = index;
    }
    
    // ---------------------------------------------
    // Verify Number
    // ---------------------------------------------
    $scope.verifyPhone = function(verificationCode){
        //$scope.newPhone.verificationCode = verificationCode;
        

        var verifyObj = {
            data: $scope.profile.phones[$scope.phoneIndex],
            token: token
        }
        verifyObj.data.verificationCode = $scope.newPhone.verificationCode;
        //console.log(verifyObj);
        
        api.verifyPhone(verifyObj)
            .success(function(data){
            if(data.success){
	            $scope.profile.phones[$scope.phoneIndex].verified = true;
                $('#newPhone').modal('toggle');
            }else{
                if(data.success != false){
                    $scope.verificationFailed = true;
                }else{
                    $scope.verifyError = true;
                }
            }
            
        }).error(function(err){
            
           alert(copy.registration.serverError);
        })
    }

    // ---------------------------------------------
    // Remove Number
    // ---------------------------------------------
    $scope.removePhone = function(index){
        
        var verifyObj = {
            data: $scope.profile.phones[index],
            token: token
        }
        api.removePhone(verifyObj)
            .success(function(data){
                $scope.profile.phones.splice(index, 1);
        }).error(function(err){
             alert(copy.registration.serverError);
        })
    }
    
    // ---------------------------------------------
    // Update profile
    // ---------------------------------------------  
    $scope.updateProfile = function(){
        
        var profileInfo = $scope.profile;
        delete profileInfo.phones;
        delete profileInfo.username;
        //delete profileInfo.dob;
        
        // ----------------------------
        // convert dob to standard time
        // ----------------------------
        $scope.profile.dob  = new PersianDate($scope.profile.dob.yr, $scope.profile.dob.mon, $scope.profile.dob.day).delocalize();
        //console.log($scope.profile.dob);
        
        var profileObj = {
            data: $scope.profile,
            token: token
        }
        api.updateProfile(profileObj)
            .success(function(data){
                $scope.profile = data;
                window.location.reload();
        }).error(function(err){
             alert(copy.registration.serverError);
        })
    }
    
});