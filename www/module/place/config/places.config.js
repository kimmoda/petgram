'use strict';
angular
    .module ('module.place')
    .run (function ($rootScope, gettextCatalog) {

    // Add Menu
    $rootScope.addMenu ({
        route: 'app.place.list',
        icon : 'ion-location',
        name : gettextCatalog.getString ('Places')
    });

});
