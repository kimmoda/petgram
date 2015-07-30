'use strict';
angular
    .module ('module.alimento')
    .run (function ($rootScope, gettextCatalog) {

    // Add Menu
    $rootScope.addMenu ({
        route: 'app.alimento.grupo',
        icon : 'ion-fork',
        name : gettextCatalog.getString ('Alimentos')
    });

});
