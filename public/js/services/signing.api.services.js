app.service('api', function($http, ENV) {
    
    return {
        signup: function(userObj){
            return $http.post(ENV.apiUrl+'/signup', userObj)
                .success(function(result) {
                    return result.data; 
                }).error(function(err){
                    //console.log(err);
                    return err;
                });
        },
        checkemail: function(emailObj){
            return $http.post(ENV.apiUrl+'/checkemail', emailObj)
                .success(function(result) {
                    return result.data; 
                }).error(function(err){
                    //console.log(err);
                    return err;
                });
        },
        checkphone: function(phoneObj){
            return $http.post(ENV.apiUrl+'/checkphone', phoneObj)
                .success(function(result) {
                    return result.data; 
                }).error(function(err){
                    //console.log(err);
                    return err;
                });
        },
        verifyphone: function(verifyObj){
            return $http.post(ENV.apiUrl+'/phone/verify', verifyObj)
                .success(function(result) {
                    return result.data; 
                }).error(function(err){
                    //console.log(err);
                    return err;
                });
        },
        resendCode: function(verifyObj){
            
            return $http.post(ENV.apiUrl+'/sms/resendCode', verifyObj)
                .success(function(result) {
                    return result.data; 
                }).error(function(err){
                    //console.log(err);
                    return err;
                });
        },
        
        signin: function(authObj){
            return $http.post(ENV.apiUrl+'/login', authObj)
                .success(function(result){
                    return result.data; 
                }).error(function(err){
                    //console.log(err);
                    return err;
                });
        },		
	        logchange: function(propertyObj){		
	            return $http.post(ENV.apiUrl+'/logchange ', propertyObj)		
	                   .success(function(result){		
	                        return result.data;		
	                    }).error(function(err){		
	                            return err;		
	                    });
       },
        propertyadd: function(propertyObj){
            return $http.post(ENV.apiUrl+'/property/add ', propertyObj)
                   .success(function(result){
                        return result.data;
                    }).error(function(err){
                            return err;
                    });
        },
        propertyupdate: function(propertyObj, propertyId){
            return $http.post(ENV.apiUrl+'/property/update/'+propertyId, propertyObj)
                   .success(function(result){
                        return result.data;
                    }).error(function(err){
                            return err;
                    });
        },
        latLong: function(address){
            return $http.post('https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key=AIzaSyDb0QyTvwp0TJ7H-8wKRgqcCGT6r21J2-s')
                   .success(function(result){
                        return result.data;
                    }).error(function(err){
                            return err;
                    });
        },
        setInfrequent: function(propertyObj){
            return $http.post(ENV.apiUrl+'/property/setInfrequent', propertyObj)
                   .success(function(result){
                        return result.data;
                    }).error(function(err){
                        return err;
                    });
        },
        setFrequent: function(propertyObj){
            return $http.post(ENV.apiUrl+'/property/setFrequent', propertyObj)
                   .success(function(result){
                        return result.data;
                    }).error(function(err){
                        return err;
                    });
        },
        updateAvailability: function(availabilityObj){
            return $http.post(ENV.apiUrl+'/availability/update', availabilityObj)
                    .success(function(result){
                        return result.data;
                    }).error(function(err){
                        return err;
                    });
        },
        getAvailability: function(propertyId){
            return $http.get(ENV.apiUrl+'/getavailability/'+propertyId)
                   .success(function(result){
                        return result.data;
                    }).error(function(err){
                        return err;
                    });
        },
        makeUnavailable: function(availabilityObj){
            return $http.post(ENV.apiUrl+'/makeunavailable', availabilityObj)
                    .success(function(result){
                        return result.data;
                    }).error(function(err){
                        return err;
                    });
        },
         madeUnavailable: function(propertyId){
            return $http.get(ENV.apiUrl+'/madeunavailable/'+propertyId)
                    .success(function(result){
                        return result.data;
                    }).error(function(err){
                        return err;
                    });
        },
        uploadFile: function(){
            return $http.get(ENV.apiUrl+'/upload/'+propertyId)
                    .success(function(result){
                        return result.data;
                    }).error(function(err){
                        return err;
                    });
        },
        uploadBackup: function(file, fileHeader){
            return $http.post(ENV.apiUrl+'/upload', file, fileHeader)
                    .success(function(result){
                        return result.data;
                    }).error(function(err){
                        return err;
                    });
        },
        upload: function(file, fileHeader){		
	            return $http.post(ENV.apiUrl+'/property/picupload', file, fileHeader)		
	                    .success(function(result){		
	                        return result.data;		
	                    }).error(function(err){		
	                        return err;		
	                    });		
	        },		
	        makeCover: function(coverObj){		
	            return $http.post(ENV.apiUrl+'/property/pic/makecover', coverObj)		
	                    .success(function(result){		
	                        return result.data;		
	                    }).error(function(err){		
	                        return err;		
	                    });		
	        },		
	        profilePic: function(file, fileHeader){		
	            return $http.post(ENV.apiUrl+'/profileupload', file, fileHeader)		
	                    .success(function(result){		
	                        return result.data;		
	                    }).error(function(err){		
	                        return err;		
	                    });		
	        },
        propertyList: function(propertyObj){
            return $http.post(ENV.apiUrl+'/property/list', propertyObj)
                    .success(function(result){
                        return result.data;
                    }).error(function(err){
                        return err;
                    });
        },
        propertyPics: function(propertyId){
            return $http.get(ENV.apiUrl+'/property/pics/'+propertyId)
                    .success(function(result){
                        return result.data;
                    }).error(function(err){
                        return err;
                    });
        },
        propertyPicRemove : function(picObj){
            return $http.post(ENV.apiUrl+'/property/removepic', picObj)
                    .success(function(result){
                        return result.data;
                    }).error(function(err){
                        return err;
                    });
        },
        propertyPicUpdate : function(picObj){
            
            return $http.post(ENV.apiUrl+'/property/picupdate', picObj)
                    .success(function(result){
                        return result.data;
                    }).error(function(err){
                        return err;
                    });
        },
        getProfile : function(picObj){
            return $http.post(ENV.apiUrl+'/profile', picObj)
                    .success(function(result){
                        return result.data;
                    }).error(function(err){
                        return err;
                    });
        },
        updateProfile : function(profileObj){
            
            return $http.post(ENV.apiUrl+'/profile/update', profileObj)
                    .success(function(result){
                        return result.data;
                    }).error(function(err){
                        return err;
                    });
        },
        phoneIsUnique : function(numberObj){
            
            return $http.post(ENV.apiUrl+'/phone/isunique', numberObj)
                    .success(function(result){
                        return result.data;
                    }).error(function(err){
                        return err;
                    });
        },
         phoneAdd : function(numberObj){
            
            return $http.post(ENV.apiUrl+'/phone/add', numberObj)
                    .success(function(result){
                        return result.data;
                    }).error(function(err){
                        return err;
                    });
        },
        verifyPhone : function(codeObj){
            
            return $http.post(ENV.apiUrl+'/phone/verify', codeObj)
                    .success(function(result){
                        return result.data;
                    }).error(function(err){
                        return err;
                    });
        },
        removePhone : function(codeObj){
            
            return $http.post(ENV.apiUrl+'/phone/remove', codeObj)
                    .success(function(result){
                        return result.data;
                    }).error(function(err){
                        return err;
                    });
        },
        updatePassword : function(codeObj){		
	            		
	            return $http.post(ENV.apiUrl+'/password/update', codeObj)		
	                    .success(function(result){		
	                        return result.data;		
	                    }).error(function(err){		
	                        return err;		
	                    });		
	        },		
	        resetPassword : function(codeObj){		
	            		
	            return $http.post(ENV.apiUrl+'/password/reset', codeObj)		
	                    .success(function(result){		
	                        return result.data;		
	                    }).error(function(err){		
	                        return err;		
	                    });		
	        },
        forgotPassword : function(passObj){		
		        		
		        return $http.post(ENV.apiUrl+'/password/forgot', passObj)		
	                    .success(function(result){		
	                        return result.data;		
	                    }).error(function(err){		
	                        return err;		
	                    });		
		        		
	        }
    }   
    
});