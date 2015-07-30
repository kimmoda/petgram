'use strict';
angular
    .module ('module.stube')
    .run (function ($rootScope, gettextCatalog) {
    // Add Menu
    $rootScope.addMenu ({
        route: 'app.stube.search',
        icon : 'icon-social-youtube',
        name : gettextCatalog.getString ('Stube')
    });
});