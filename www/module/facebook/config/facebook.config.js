'use strict';
angular.module ('module.facebook')
    .run (function ($rootScope, gettextCatalog) {

    // Add Menu
    $rootScope.addMenu ({
        route: 'app.facebook.feed',
        icon : 'ion-social-facebook',
        name : gettextCatalog.getString ('Facebook')
    });

});
