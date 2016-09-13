app.controller('landing', function($scope, $uibModal, copy, $window, $modal){
    
    $scope.signing = '';

    $scope.copy = copy;
    $scope.name = "First Name";
    $scope.user = JSON.stringify($window.user);
    $scope.animationsEnabled = false;
    $scope.landing = true;
    
    
    
    
    
    /*$modal.open({
        templateUrl: 'views/tpl/signing.tpl.html',
        resolve: {
        signing: function () {
            return $scope.items;
        }}
    });*/
    
	$scope.openPopUp = function () {

		var scope = $scope.$new();
		
		var tempUrl = "";
		tempUrl = '../../Views/forgotPassword.client.view.html';

	    var modalInstance = $uibModal.open({
	      animation: $scope.animationsEnabled,
	      scope: scope,
            size: 'sm',
	      templateUrl: tempUrl,
	      controller: 'FPModalInstanceCtrl',
	    });

	    modalInstance.result.then(function () {
	    }, function () {
	    });

	};

});

