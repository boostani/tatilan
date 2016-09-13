
app.service('urlParam', function($http, ENV) {
    
    return {
        get : function(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }
    }
});

app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl, bodyObj){
        var fd = new FormData();
        fd.append('file', file);
        fd.append('propertyId', bodyObj.propertyId);
        fd.append('token', bodyObj.token);
        
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined, 'body': bodyObj}
        }).success(function(result){
           return result.data;
        }).error(function(err){
           return err;
        });
    }
}]);