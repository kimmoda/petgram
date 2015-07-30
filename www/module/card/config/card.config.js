'use strict';
angular
    .module ('module.card')
    .run (function ($rootScope, gettextCatalog) {

    // Add Menu
    $rootScope.addMenu ({
        route: 'app.card.home',
        icon : 'ion-ios-browsers',
        name : gettextCatalog.getString ('Tinder Cards')
    });

});
