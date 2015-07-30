'use strict';
angular
    .module ('module.gallery')
    .run (function ($rootScope, gettextCatalog) {

    // Add Menu
    $rootScope.addMenu ({
        route: 'app.galleries',
        icon : 'ion-images',
        name : gettextCatalog.getString ('Galleries')
    });

});
