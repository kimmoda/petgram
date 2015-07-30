'use strict';
angular
    .module ('module.futebol')
    .run (function ($rootScope, gettextCatalog) {

    // Add Menu
    $rootScope.addMenu ({
        route: 'app.equipes',
        icon : 'ion-ios-football',
        name : gettextCatalog.getString ('Soccer')
    });

});
