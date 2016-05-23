(function () {
    'use strict';
    angular
        .module('app.user', [
            'ionic'
        ])
        .config(configRoutes);

    var path = 'app/module/user';
    
    function configRoutes($stateProvider, $urlRouterProvider, $translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart(path);

        $stateProvider

            .state('user', {
                url: '/user',
                abstract: true,
                templateUrl: path + '/module/layout/user-layout.html'
            })

            .state('user.intro', {
                url: '/intro',
                templateUrl: path + '/module/intro/user-intro.html',
                controller: 'UserIntroCtrl',
                controllerAs: 'vm'
            })

            .state('user.register', {
                url: '/register',
                templateUrl: path + '/module/register/user-register.html',
                controller: 'UserRegisterCtrl',
                controllerAs: 'vm'
            })

            .state('user.login', {
                url: '/login',
                templateUrl: path + '/module/login/user-login.html',
                controller: 'UserLoginCtrl',
                controllerAs: 'vm'
            })

            .state('user.merge', {
                url: '/merge',
                controller: 'UserMergeCtrl',
                controllerAs: 'vm',
                templateUrl: path + '/module/merge/merge.html'
            })

            .state('logout', {
                url: '/logout',
                template: '<ion-view view-title="Logout" cache-view="false"><ion-content></ion-content></ion-view>',
                controller: 'UserLogoutCtrl',
                controllerAs: 'vm'
            })


        ;

        $urlRouterProvider.otherwise('/');

    }

})();