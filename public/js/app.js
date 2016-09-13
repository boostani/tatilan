var app = angular.module('tatilan', ['ngRoute', 'ui.router', 'ngAnimate', 'jkuri.gallery', 'ngCookies', 'ui.bootstrap', 'ui.bootstrap.persian.datepicker', 'ui.bootstrap.datepicker', 'ngAutocomplete']);


app.config(function($locationProvider){
    /*$locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });*/
});

 app.run(function($rootScope){

 });

 app.constant("ENV", {
        "apiUrl": "http://localhost:3000"
    })

