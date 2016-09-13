
app.controller('fileUploadCtrl', ['$scope', 'Upload', function ($scope, Upload) {
    // upload later on form submit or something similar
    $scope.submit = function() {
      if ($scope.form.file.$valid && $scope.file) {
        $scope.upload($scope.file);
      }
    };

    // upload on file select or drop
    $scope.upload = function (file) {
        Upload.upload({
            url: '/upload',
            data: {file: file, 'username': $scope.username}
        }).then(function (resp) {
            //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            //console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };
    // for multiple files:
    $scope.uploadFiles = function (files) {
		// TODO:: NEED TO HAVE CORRECT ATTRIBUTES FOR UPLOAD CALL...
		if (files && files.length) {
			Upload.upload({url: 'https://angular-file-upload.s3.amazonaws.com/', //S3 upload url including bucket name
						method: 'POST',
						data: {file: files}
					});
		}
	};
}]);

app.controller('navCtrl', function($scope, $uibModal, copy, $modal, $window, profilePic){
    
    $scope.copy = copy;
    $scope.signing = 'signUp';
    
    $scope.selectModal = function(val){
        $scope.signing = val;
        //console.log($scope.signing);
    }

   $scope.profileUrl = profilePic.getUrl();		
	    		
	$scope.$watch(function () { return profilePic.getUrl(); }, function (newValue, oldValue) {		
	    if (newValue !== oldValue) $scope.profileUrl = newValue;		
	});
    
    $scope.openModal = function(selection) {

        var modalInstance = $modal.open({
          templateUrl: 'signing.html',
          controller: signingCtrl,
          resolve: {
            item: function () {
              return selection;
            }
          }
        });

    };

});