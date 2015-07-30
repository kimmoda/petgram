'use strict';
angular
    .module ('module.miscellaneous')
    .run (function ($rootScope, gettextCatalog) {
    // Add Menu
    $rootScope.addMenu ({
        route: 'app.miscellaneous',
        icon : 'ion-ionic',
        name : gettextCatalog.getString ('Miscellaneous')
    });
});