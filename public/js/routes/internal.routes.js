
app.config(function($stateProvider, $urlRouterProvider) {

    //$urlRouterProvider.otherwise('/profile');

 
    $stateProvider
    .state('landing', {
        url: '/',
        //template: '<h1>Welcome to your inbox</h1>'
        templateUrl: 'views/tpl.internal/profile.tpl.html'
      })
     
      .state('profile', {
        url: '/profile',
        //template: '<h1>Welcome to your inbox</h1>'
        templateUrl: 'views/tpl.internal/profile.tpl.html',
        controller: 'profile'
      })
      .state('profile.password', {
            url: '/password',
            templateUrl: 'views/tpl.internal/password.tpl.html',
            controller: 'password'
       })
      .state('profile.edit', {
        url: '/edit',
        //template: '<h1>Welcome to your inbox</h1>'
        templateUrl: 'views/tpl.internal/profile.edit.tpl.html',
        controller: 'profileEdit'
      })
      .state('listings', {
        url: '/listings',
        //template: '<h1>Welcome to your inbox</h1>'
        templateUrl: 'views/tpl.internal/listings.tpl.html',
        controller: 'listings'
      })
      .state('sales', {
        url: '/sales',
        //template: '<h1>Welcome to your inbox</h1>'
        templateUrl: 'views/tpl.internal/sales.tpl.html'
      })
    .state('trips', {
        url: '/trips',
        //template: '<h1>Welcome to your inbox</h1>'
        templateUrl: 'views/tpl.internal/trips.tpl.html'
      })
      .state('trips.details', {
        url: '/details',
        //template: '<h1>Welcome to your inbox</h1>'
        templateUrl: 'views/tpl.internal/trip.details.tpl.html'
      });
    
});