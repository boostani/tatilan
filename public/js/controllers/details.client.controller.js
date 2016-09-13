app.controller('details', function($scope, $uibModal, copy, $window, $filter){
    
       $scope.copy = copy;
        $scope.calendarOpen = false;
    $scope.today = function() {
        $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };
  
  $scope.images = [];
  for(var i=0; i< $window.details.pictures.length; i++){
     $scope.images.push({
         thumb: 'https://s3.eu-central-1.amazonaws.com/tatilan/properties/'+$window.details.id+'/'+$window.details.pictures[i].name+'-thumb.png',
         img: 'https://s3.eu-central-1.amazonaws.com/tatilan/properties/'+$window.details.id+'/'+$window.details.pictures[i].name+'-large.png',
         description: $window.details.pictures[i].description
     });
  }
    // ---------------------------
    // Initial page rendering
    // ---------------------------
    $scope.details = $window.details;
    $scope.search = $window.search;
    $scope.basePrice = $scope.details.basePrice;
    $scope.numDays = $scope.search.numDays == null? '' : $scope.search.numDays;
     $scope.dateUpdate = function(date, action){
        //console.log(date);
        //console.log(action);
        if(action == 'remove'){
            $scope.selectCheckout = true;
            //$scope.checkIn = $filter('date')(date, "yyyy/MM/dd");
            $scope.checkIn = momentJ(date).format('jYYYY/jM/jD');
            $scope.rawCheckIn = moment(date);
        }else{
            //$scope.checkOut = $filter('date')(date, "yyyy/MM/dd");
            $scope.checkOut = momentJ(date).format('jYYYY/jM/jD');
            $scope.rawCheckOut = moment(date);
            $scope.numDays = $scope.rawCheckOut.diff($scope.rawCheckIn, 'days');
            $scope.serviceFee = Math.round($scope.numDays*$scope.details.basePrice*8/100);
            $scope.total = $scope.numDays*$scope.details.basePrice+Math.round($scope.numDays*$scope.details.basePrice*8/100);
            $scope.calendarOpen = false;
            $scope.selectCheckout = false;
            
        }
    }
  
    var mndate = new Date();
	var mxdate = new Date();
    mndate.setHours(11, 59, 0, 0);
    mxdate.setHours(0, 0, 0, 0);
	$scope.minDate = mndate.setDate(mndate.getDate() - 1);//the day before today
	$scope.maxDate = mxdate.setDate(mxdate.getDate() + 365);//next year
    
     $scope.dateOptions = {
        //dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: mxdate.setDate(mxdate.getDate() + 365),
        minDate: mndate.setDate(mndate.getDate() - 1),//the day before today,
        startingDay: 1,
        selectRange: true,
        element: document.getElementById('from-date')
      };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && date.getDay() === 5  );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.openPersian = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.persianIsOpen = true;
    $scope.gregorianIsOpen = false;
  };
  $scope.openGregorian = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.gregorianIsOpen = true;
    $scope.persianIsOpen = false;
  };


   

  $scope.initDate = new Date();
  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[1];
    
  $scope.handleCalendar = function(){
      $scope.calendarOpen = true;
  }
});