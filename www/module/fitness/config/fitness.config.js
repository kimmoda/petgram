'use strict';
angular
    .module ('module.fitness')
    .run (function ($rootScope, gettextCatalog) {
    // Add Menu
    $rootScope.addMenu ({
        route: 'app.fitness.home',
        icon : 'ion-android-bicycle',
        name : gettextCatalog.getString ('Fitness')
    });
});