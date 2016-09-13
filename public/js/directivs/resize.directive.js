app.directive('resize', function ($window) {
	return function (scope, element) {
		var w = angular.element($window);
		scope.getWindowDimensions = function () {
			return { 'h': w.height(), 'w': w.width() };
		};
		scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
			scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;
            
            scope.fullHeight = function (deduct) {
				return { 
                    'height': (newValue.h - deduct) + 'px'
                    //'width': (newValue.w) + 'px' 
                };
			};
            
		}, true);
	
		w.bind('resize', function () {
			scope.$apply();
		});
	}
})