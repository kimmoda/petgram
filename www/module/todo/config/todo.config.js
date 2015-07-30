'use strict';
angular
    .module ('module.todo')
    .run (function ($rootScope, gettextCatalog) {

    $rootScope.addMenu ({
        route: 'app.todo',
        icon : 'ion-ios-list',
        name : gettextCatalog.getString ('Todo')
    });

});
