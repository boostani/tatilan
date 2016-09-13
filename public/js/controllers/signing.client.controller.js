app.controller('signingCtrl', function($scope, $uibModal, copy, api, $window, $location, $route, $cookieStore){
    
    // ----------------------
    // Initializing Objects
    // ----------------------

   
    $scope.user         = {};
    $scope.phone        = {};
    $scope.dob          = {};
    $scope.signinObj    = {};
    $scope.form         = {};
    $scope.loginError   = '';
    $scope.signupError  = '';
    $scope.copy         = copy;
    $scope.spinner      = {};
    $scope.resendingCode = false;
    
    
    
    if(typeof $scope.signing == 'undefined'){
        $scope.signing = "signUp";
    }
    
    $scope.switchLogin = function(val){
        
        $scope.signing =  val;
        if(val == 'passwordReset'){
            
            
        }
    }
    
    // --------------------------------
    // update form base on browser hash
    // --------------------------------
    function getUrlParam(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    
    // -----------------------------
    // check if email is unique
    // -----------------------------
    $scope.emailIsUnique = function(email){
        $scope.form.registrationForm.username.$setValidity('unique', true);
        api.checkemail({username:email})
        .success(function(result){
                if(!result.unique){
                    $scope.form.registrationForm.username.$setValidity('unique', false);
                }
            })
            .error(function(err){
                $scope.signupError = copy.error.signup;
            });
    }
    
    // -----------------------------
    // check if phone is unique
    // -----------------------------
    $scope.phoneIsUnique = function(area, phone){
        $scope.form.registrationForm.cellNumber.$setValidity('unique', true);
        api.checkphone({areaCode:area, phoneNumber: phone})
        .success(function(result){
                if(result.count>0){
                    $scope.form.registrationForm.cellNumber.$setValidity('unique', false);
                }
            })
            .error(function(err){
                $scope.signupError = copy.error.signup;
            });
    }


    
    $scope.signup = function(){
        $scope.spinner.signup = true;
        if(!$scope.dob.year || !$scope.dob.month || !$scope.dob.day){
           $scope.signupError = copy.error.dob;
        }else {
             $scope.user.dob = new PersianDate($scope.dob.year, $scope.dob.month, $scope.dob.day).toDate();
        }
        
        
        api.signup($scope.user)
           .success(function(result){
                $scope.spinner.signup = false;
                $cookieStore.put('token', result.user.token);
                $scope.user = result.user;
                $scope.loginError = '';
                $scope.selectModal('confirmPhone');
                
            })
            .error(function(err){
                $scope.spinner.signup = false;
                $scope.signupError = $scope.copy.error.signup;
            });
        
    };
    
    // -----------------------------
    // verify phone
    // -----------------------------
    
    $scope.verifyPhone = function(code){

        var verificationObj = {
            token: $cookieStore.get('token'),
            data: {
                phoneNumber : $scope.user.phone.phoneNumber,
                areaCode    : $scope.user.phone.areaCode,
                verificationCode: code
            }
        }
        
        api.verifyphone(verificationObj)
            .success(function(result){

                if(result.success){
                    if(getUrlParam('redirect') == null){
                        //$scope.dismiss();
                        $scope.selectModal('confirmation');
                    }else{
                        $scope.dismiss();
                        $window.location = '/'+getUrlParam('redirect');
                    }
                } else {
                    
                    if(result.securityReset){
                        $scope.verificationFailed = true;
                    }else if(!result.success){
                        $scope.verifyError = true;
                    }
                }
            })
            .error(function(err){
                $scope.signupError = $scope.copy.error.signup;
            });
        
    };
    
    $scope.resendCode = function(){
    
       $scope.spinner.resendingCode = true;   
       var verificationObj = {
            token: $cookieStore.get('token'),
            data: {
                to: $scope.user.phone.fullNumber 
            }
        }
       api.resendCode(verificationObj)
          .success(function(result){
            $scope.spinner.resendingCode = false; 
           }).error(function(err){
               // $scope.signupError = $scope.copy.error.signup;
                $scope.spinner.resendingCode = false; 
           });
                
         
    }
    
    // -----------------------------
    // Refresh Page
    // -----------------------------    
    $scope.reloadPage = function(){
        //$scope.dismiss();
        $window.location.reload();
        location.reload();
    }
    
    // -----------------------------
    // Sign In
    // -----------------------------
    
    
    $scope.signin = function(){
        
        api.signin($scope.signinObj).success(function(result){
                $scope.dismiss();
                $cookieStore.put('token', result.token);
                if(getUrlParam('redirect') == null){
                    $window.location.reload();
                }else{
                    //var newLocation = getUrlParam('redirect').split('+').join('/');
                    $window.location = getUrlParam('redirect');
                }
            }).error(function(err){
                $scope.loginError = copy.error.login;
                
            });
         
    };
    // ---------------------------------------------		    
	// Send password Reset		   
	// ---------------------------------------------   		   
	    $scope.sendPassword = function(emailAddress){		
		    $scope.spinner.password = true;		
			$scope.forgotEmailError = false;		
		    api.forgotPassword({email:emailAddress})		
		    	.success(function(result){		
			    	$scope.spinner.password = false;		
			    	$scope.$parent.signing = 'passwordConfirmation';		
			      // $scope.selectModal('passwordConfirmation');		
		           //console.log(result);		
		            //$cookieStore.put('token', result.user.token);		
	                //$scope.loginError = '';		
	                //$scope.dismiss();		
	                //$scope.selectModal('confirmPhone');		
	                $scope.resetEmail = emailAddress;		
	                		
	            })		
	            .error(function(err){		
			        $scope.spinner.password = false;   		
			        $scope.forgotEmailError = true;		
			        //console.log($scope.forgotEmailError);		
			
	                //console.log(err);		
	            });		
			
	    } 
    
    
});