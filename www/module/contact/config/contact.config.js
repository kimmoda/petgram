'use strict';
angular
    .module ('module.contact')
    .run (function ($rootScope, gettextCatalog) {

    $rootScope.addMenu ({
        route: 'app.contact',
        icon : 'ion-ios-people',
        name : gettextCatalog.getString ('Contact')
    });

});
