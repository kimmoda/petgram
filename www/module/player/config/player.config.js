'use strict';
angular
    .module ('module.player')
    .run (function ($rootScope, gettextCatalog) {

    // Add Menu
    $rootScope.addMenu ({
        route: 'app.player',
        icon : 'icon-music-tone',
        name : gettextCatalog.getString ('Player')
    });

});
