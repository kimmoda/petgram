'use strict';
angular
    .module ('module.gallery')
    .run (function ($rootScope, gettextCatalog) {

    // Add Menu
    $rootScope.addMenu ({
        route: 'app.gallery.home',
        icon : 'ion-camera',
        name : gettextCatalog.getString ('Ionictagram')
    });

});
