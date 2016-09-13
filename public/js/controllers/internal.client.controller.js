app.controller('internal', function($scope, $uibModal, copy, $state){
    
       $scope.copy = copy;
    $scope.$state = $state; 
    //$state.transitionTo('profile.edit');
    //console.log($state.includes('edit'));


});

app.controller('listings', function($scope, copy, $state, api, $cookieStore){
    
    $scope.copy = copy;
    $scope.properties = [];
    
    var propertyObj = {
        token: $cookieStore.get('token')
    };
    
    api.propertyList(propertyObj).success(function(result){
        $scope.properties = result;
    }).error(function(err){
         alert(copy.registration.serverError);
    });
    



});