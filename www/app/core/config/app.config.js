'use strict';
angular
    .module ('module.core')
    .run (function ($rootScope, gettextCatalog) {

        $rootScope.menu = [];

        // Add Sidebar Menu
        $rootScope.addMenu = function (menu) {
            $rootScope.menu.push ({
                name : menu.name,
                route: menu.route,
                icon : menu.icon
            });
        };

        // Add Menu Dashboard
        $rootScope.addMenu ({
            route: 'app.home',
            icon : 'icon-home',
            name : gettextCatalog.getString ('Home')
        });

    });
