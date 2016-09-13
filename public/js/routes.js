
app.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js


    $stateProvider.state('app', {
        abstract: true,
        controller: 'appCtrl',
        template: '<ion-nav-view name="todos"></ion-nav-view>'
    });

    $stateProvider.state('app.landing', {
        abstract: true,
        url: '',
        views: {
            todos: {
                template: '<ion-nav-view></ion-nav-view>'
            }
        }
    });
   



});