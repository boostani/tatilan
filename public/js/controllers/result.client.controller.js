app.directive('searchLocationResult', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/tpl/result_partial.html', // markup for template
        scope: {
            id: '=' // allows data to be passed into directive from controller scope
        }
    };
});
app.controller('searchResultController', function($scope) {
    // sample objects in the controller scope that gets passed to the directive


});

//path: 'm-11.17776,-34.14405l22.17776,-0.10595l0,9.96916c-2.07089,0 -5.0809,0 -7.15179,0l-4.26217,5.05682c-1.61337,-1.66153 -2.57657,-3.03409 -4.18994,-4.69562c-3.10633,0.02408 -5.41802,-0.09632 -6.6461,-0.07224l0.07224,-10.15216l0,-0.00001z',

var markerStyle = {textColor: 'fff', backgroundColor: '26B2D4', borderColor:'278EA7'}
var highlightedStyle = {textColor: 'fff', backgroundColor: '278EA7', borderColor:'26B2D4'}
function normalIcon(content){return {url: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2235%22%20width%3D%2286%22%20%3E%0A%20%20%3Cpath%20fill%3D%22%23'+markerStyle.backgroundColor+'%22%20stroke%3D%22%23'+markerStyle.borderColor+'%22%20stroke-width%3D%221%22%20d%3D%22M0%200%20L86%200%20L86%2030%20L46%2030%20L40%2035%20L34%2030%20L0%2030%20Z%22%20%2F%3E%0A%20%20%3Ctext%20transform%3D%22translate(39%2018.5)%22%20fill%3D%22%23'+markerStyle.textColor+'%22%20style%3D%22font-family%3A%20BYekan%2C%20sans-serif%3Bfont-weight%3Abold%3Btext-align%3Acenter%3B%22%20font-size%3D%2212%22%20text-anchor%3D%22middle%22%3E'+content+'%3C%2Ftext%3E%0A%3C%2Fsvg%3E'}}      
function highlightedIcon(content){return {url: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20height%3D%2235%22%20width%3D%2286%22%20%3E%0A%20%20%3Cpath%20fill%3D%22%23'+highlightedStyle.backgroundColor+'%22%20stroke%3D%22%23'+highlightedStyle.borderColor+'%22%20stroke-width%3D%221%22%20d%3D%22M0%200%20L86%200%20L86%2030%20L46%2030%20L40%2035%20L34%2030%20L0%2030%20Z%22%20%2F%3E%0A%20%20%3Ctext%20transform%3D%22translate(39%2018.5)%22%20fill%3D%22%23'+highlightedStyle.textColor+'%22%20style%3D%22font-family%3A%20Arial%2C%20sans-serif%3Bfont-weight%3Abold%3Btext-align%3Acenter%3B%22%20font-size%3D%2212%22%20text-anchor%3D%22middle%22%3E'+content+'%3C%2Ftext%3E%0A%3C%2Fsvg%3E'}};

function pinSymbol(color) {
    return {
        path: 'm-11.17776,-34.14405l22.17776,-0.10595l0,9.96916c-2.07089,0 -5.0809,0 -7.15179,0l-4.26217,5.05682c-1.61337,-1.66153 -2.57657,-3.03409 -4.18994,-4.69562c-3.10633,0.02408 -5.41802,-0.09632 -6.6461,-0.07224l0.07224,-10.15216l0,-0.00001z',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#278EA7',
        strokeWeight: 2,
        scale: 2
    };
}

app.directive('resultingMap', function() {
    // directive link function
    var link = function(scope, element, attrs) {
        var map, infoWindow;
        var markers = [];
        
        // map config
        var mapOptions = {
            center: new google.maps.LatLng(50, 2),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
        };
        
        // init the map
        function initMap() {
            if (map === void 0) {
                map = new google.maps.Map(element[0], mapOptions);
            }
        } 
        
        // place a marker
        function setMarker(id, map, style, content, label) {
            var marker;
            var markerOptions = {
                position: style.position,
                map: map,
                labelContent: content,
                labelClass: "labels",
				id: id,
                title: content.title,
                icon: normalIcon(content.label)
                //icon: pinSymbol('#26B2D4 ')
            };
            marker = new google.maps.Marker(markerOptions);
			//marker.content = content.label;
			marker.setDraggable(true);
            markers.push(marker); // add marker to array
            
            google.maps.event.addListener(marker, 'mouseleave', function () {
				$(".location-base",$("body")).removeClass("hovered");
			});
            google.maps.event.addListener(marker, 'mouseover', function () {
				var win = $("body");
				$(".location-base",win).removeClass("hovered");
				$("#location"+$(content.text).attr("id"),win).addClass("hovered");
			});
            google.maps.event.addListener(marker, 'click', function () {
                // close window if not undefined
                if (infoWindow !== void 0) {
                    infoWindow.close();
                }
                // create new window
                var infoWindowOptions = {
                    content: content.text
                };
                infoWindow = new google.maps.InfoWindow(infoWindowOptions);
				google.maps.event.addListener(infoWindow,'closeclick',function(){
					$(".location-base",$("body")).removeClass("selected").removeClass("hovered");
				});
				var cnt = $(infoWindowOptions.content);
				var id = cnt.attr("id");
				var win = $("body");
				var mk = $("#location"+id,win)
				$(".location-base",win).removeClass("selected").removeClass("hovered");
				mk.addClass("selected");
                infoWindow.open(map, marker);
            });
        }
        
        // show the map and place some markers
        initMap();
        
        setMarker("345345",map, {position: new google.maps.LatLng(51.508515, -0.125487),size:14,weight:5,color:'#000',stroke:'#fff'}, {title:'London', label:'۱۸۰۰ تومان', text:'<span class="marker-info" id="345345"><strong>Just some htlm desription with images</strong><br/>قیمت: ۱۸۰۰ تومان</span>'}, 300);
        setMarker("345366",map, {position: new google.maps.LatLng(52.370216, 4.895168), size:14,weight:5,color:'#000',stroke:'#fff'}, {title:'Amsterdam', label:'۱۳۰۰ تومان', text:'<span class="marker-info" id="345366"><i>More content</i><br/>قیمت: ۱۳۰۰ تومان</span>'}, 240);
        setMarker("345388",map, {position: new google.maps.LatLng(48.856614, 2.352222), size:14,weight:5,color:'#000',stroke:'#fff'}, {title:'Paris', label:'۲۳۰۰ تومان', text:'<span class="marker-info" id="345388">Text here<br/>قیمت: ۲۳۰۰ تومان</span>'}, 200);
setTimeout(function(){
	var x = $(".location-base",$("body"));
		x.on("mouseover", function(){
			var id = $(this).attr("id").substring(8);
			for(var i=0;i<markers.length;i++){
				var mk = markers[i];
				if(mk.id == id){
				   mk.setIcon(highlightedIcon(mk.content));
				   //mk.setAnimation(google.maps.Animation.BOUNCE);
				}else {
				   mk.setIcon(normalIcon(mk.content));
				   //mk.setAnimation(null);
				}
			}
		});
		x.on("mouseleave", function(){
			var id = $(this).attr("id").substring(8);
			for(var i=0;i<markers.length;i++){
				var mk = markers[i];
				mk.setIcon(normalIcon(mk.content));
				//mk.setAnimation(null);
			}
		});
},4000);
	};
    
    return {
        restrict: 'A',
        template: '<div id="gmaps"></div>',
        replace: true,
        link: link
    };
});

app.controller('result', function($scope, $uibModal, copy){

    $scope.copy = copy;
    $scope.name = "First Name";
    $scope.user = window.user;
    $scope.animationsEnabled = false;
    
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
    
    
    // map stuff
    
    
    

})