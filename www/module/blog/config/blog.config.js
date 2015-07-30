'use strict';
angular
    .module ('module.blog')
    .run (function ($rootScope, gettextCatalog) {

    // Add Menu
    $rootScope.addMenu ({
        route: 'app.blog',
        icon : 'ion-social-wordpress',
        name : gettextCatalog.getString ('Wordpress')
    });

});
