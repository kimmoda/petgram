'use strict';
angular
    .module ('module.fitness')
    .config (function ($stateProvider) {
    $stateProvider
        .state ('app.fitness', {
        url  : '/fitness',
        views: {
            menuContent: {
                templateUrl: 'module/fitness/view/fitness.tab.html'
            }
        }
    })

        .state ('app.fitness.home', {
        url  : '/home',
        views: {
            tabHome: {
                controller : 'FitnessHomeCtrl as FitnessHome',
                templateUrl: 'module/fitness/view/fitness.home.html'
            }
        }
    })

    ;
});