app.controller('calendar', function($scope, copy, $state, $location, $cookieStore, $window, api, $route, propertyCover, profilePic){

	var mndate = new Date();
	var mxdate = new Date();
    $scope.copy = copy;
    $scope.activeDate;
    $scope.type = 'individual';
    $scope.user = $window.user;
    $scope.coverPic = propertyCover.getUrl();
    $scope.profilePic = profilePic.getUrl();
	//$scope.selectedDates = [new Date().setHours(0, 0, 0, 0)];

    $scope.selectedDates = [];
    $scope.disabledDates = [];// call api to fill this right away...
	
	mndate.setHours(11, 59, 0, 0);
	mxdate.setHours(0, 0, 0, 0);
	$scope.minDate = mndate.setDate(mndate.getDate() - 1);//the day before today
	$scope.maxDate = mxdate.setDate(mxdate.getDate() + 365);//next year
    
    
    
    // ----------------------------------------- 
    // check project status
    // ----------------------------------------- 
    
    //if(!$scope.$parent.home.listingCompleted && !scope.$parent.changes.length<7){
        
    //}

    // ----------------------------------------- 
    // get the availability
    // -----------------------------------------  

    api.getAvailability($scope.$parent.home.id)
           .success(function(result){
               // //console.log(result);
                $scope.dates = result;

                // -----------------------
                // Add disabled dates
                // -----------------------

                  for(var i = 0; i<$scope.dates.reserved.length; i++){
                        var selectedDate = new Date($scope.dates.reserved[i].date);
                        $scope.disabledDates.push(selectedDate.getTime());
                    }

                if($scope.$parent.home.frequentRenter){
                    
                   $scope.availableSetup();
                    
                }else{
                    
                   $scope.unavailableSetup();
                }
                
           })
           .error(function(err){
                alert(copy.registration.serverError);
           });


  


    $scope.dateDisabled = function(options) {
            var result = false;
            if(options){
                var date = options.date;
                var mode = options.mode;

                // need to have disabled dates cached within the scope before this method is called.. because it is called 30 times in a month..
                for(var i=0;i<=$scope.disabledDates.length;i++){
                    if($scope.disabledDates[i]==date){
                        result = true;
                        break;
                    }
                }
            }
            return result;
       };
	
    // ----------------------------------------- 
    // if property is not frequently available
    // -----------------------------------------    
    $scope.unavailableSetup = function(){
        
        for(var i = 0; i<$scope.dates.available.length; i++){
                //var selectedDate = moment($scope.dates.available[i].startDate).toDate();
                //$scope.selectedDates.push(selectedDate.getTime());
                var range =  moment.range($scope.dates.available[i].startDate, moment($scope.dates.available[i].endDate).subtract(1, 'day'));
                range.by('days', function(moment){
                    $scope.selectedDates.push(moment.startOf('day').valueOf());
                });
        }
        
        //console.log($scope.selectedDates);
        //$scope.selectedDates = ['1474403400000'];
        // //console.log($scope.selectedDates);
        
        // --------------------------
        // method to update the table
        // --------------------------
        $scope.dateUpdate = function(selectedDate, dbAction) {

        var formattedDate = new Date(selectedDate);
        formattedDate = formattedDate.toISOString();
           // //console.log(formattedDate);
            var momentDate = moment(selectedDate).utc();
           // //console.log(selectedDate);

         //console.log(momentDate);
        var availabilityObj = {
            token: $cookieStore.get('token'),
            data: {
                action: dbAction, 
                date: selectedDate,
                propertyId: $scope.$parent.home.id,
                available: true
            }
        };
        
        api.updateAvailability(availabilityObj)
           .success(function(result){
               // //console.log(result);
            })
           .error(function(err){
                alert(copy.registration.serverError);
            });
        }
        
    }
    // ----------------------------------------- 
    // if property is not frequently available
    // -----------------------------------------
    $scope.availableSetup = function(){
       
     for(var i = 0; i<$scope.dates.unavailable.length; i++){
         var range =  moment.range($scope.dates.unavailable[i].startDate, moment($scope.dates.unavailable[i].endDate).subtract(1, 'day'));
         range.by('days', function(moment){
              $scope.selectedDates.push(moment.startOf('day').valueOf());
         });
        /* var selectedDate = moment($scope.dates.unavailable[i].startDate).startOf('day').valueOf();
        //var selectedDate = new Date($scope.dates.unavailable[i].startDate);
         // //console.log(range);
        $scope.selectedDates.push(selectedDate);*/
     };
                                    //1474416000000
        //$scope.selectedDates = [1474227000000, 1474403400000];
      // //console.log($scope.selectedDates); 
         
       
       $scope.dateUpdate = function(selectedDate, dbAction) {

        /*if(dbAction == 'add'){
            dbAction = 'remove'
        }else{
            dbAction = 'add'
        }*/
        // //console.log('availableSetup');

        var formattedDate = new Date(selectedDate);
           // //console.log(formattedDate);
           var momentDate = moment(selectedDate).utc();

        // //console.log(selectedDate);
           
        formattedDate = formattedDate.toISOString();
        var availabilityObj = {
            token: $cookieStore.get('token'),
            data: {
                action: dbAction, 
                date: selectedDate,
                propertyId: $scope.$parent.home.id,
                available: false
            }
        };
        
        api.updateAvailability(availabilityObj)
           .success(function(result){
               // //console.log(result);
            })
           .error(function(err){
                alert(copy.registration.serverError);
            });
        }
        
    }

    $scope.completeRegistration = function(){

        $scope.submit({listingCompleted: true}, 'calendar', 'calendar');

    }
    
    // -----------------------------
    // change page
    // -----------------------------
    $scope.changePage = function(page){
       // //console.log('change path');
        $location.path('/property/'+$scope.$parent.home.id+'#/'+page);
        //$location.reload();
        $route.reload();
        //$location.path();
    }
   
    
		
    $scope.removeFromSelected = function(dt) {
       // //console.log(dt);
        $scope.selectedDates.splice($scope.selectedDates.indexOf(dt), 1);
   }
		
		
    
});
