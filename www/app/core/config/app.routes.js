'use strict';
angular
    .module ('module.core')
    .config (function ($ionicConfigProvider, $stateProvider, $urlRouterProvider) {

    $stateProvider

        .state ('router', {
        url       : '/',
        template  : '',
        controller: function ($state) {
            if (Parse.User.current ()) {
                $state.go ('gallery.home');
            } else {
                $state.go ('user.login');
            }
        }
    })

        .state ('app', {
        url        : '/app',
        abstract   : true,
        templateUrl: 'app/core/view/side.menu.html',
        controller : 'SidemenuCtrl as SideMenu'
    })

        .state ('app.home', {
        url  : '/home',
        views: {
            menuContent: {
                templateUrl: 'app/core/view/app.home.html',
                controller : 'HomeCtrl as Home'
            }
        }
    })

        .state ('app.setting', {
        url  : '/setting',
        views: {
            menuContent: {
                templateUrl: 'app/core/view/app.setting.html'
            }
        }
    })

        .state ('app.about', {
        url  : '/about',
        views: {
            menuContent: {
                templateUrl: 'app/core/view/app.about.html'
            }
        }
    })
    ;

    $urlRouterProvider.otherwise ('/');
});
