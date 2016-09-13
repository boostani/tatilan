app.directive('digit',function(){
  return{
    //restrict: 'E',
    //require: 'ngModel',
    scope: {
      model: '=ngModel' 
    },
	controller: function($scope){
        
     	$scope.$watch('model', function(newVal, oldVal) {

	     	if(newVal != oldVal){
                var englishDigits 	= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
				var persianDigits	= ['۰', '۱','۲', '۳','۴','۵','۶','۷','۸','۹'];	
				if($scope.model){
				var character = $scope.model.toString();
				var lastChar	= character[character.length-1];
				
				
					if(typeof lastChar == 'undefined'){
						
						$scope.model = '';
						
					} else if($.inArray(parseInt(lastChar), englishDigits) > -1){
						
						$scope.model = $scope.model;
						
						
					}else if($.inArray(lastChar, persianDigits) > -1){
						
						var replacement = englishDigits[persianDigits.indexOf(lastChar)];
						$scope.model = character.replace(new RegExp(lastChar, 'g') , replacement);
						
						
					}else if($.inArray(parseInt(lastChar), englishDigits) == -1 && $.inArray(lastChar, persianDigits) == -1){
						
						$scope.model = oldVal; 
					}
				  }
                }
                
            });
    }
  }
});