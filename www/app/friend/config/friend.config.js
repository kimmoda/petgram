'use strict';
angular
    .module ('module.friend')
    .run (function ($rootScope, gettextCatalog) {
    // Add Menu
    $rootScope.addMenu ({
        route: 'app.friend.home',
        icon : 'ion-person',
        name : gettextCatalog.getString ('Friends')
    });
});