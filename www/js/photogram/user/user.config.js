(function (window, angular, undefined) {
    'use strict';
    angular
        .module('app.photogram')
        .config(addRoute);

    function addRoute($stateProvider, $urlRouterProvider, AppConfig) {

        var path = AppConfig.path;
        
        $stateProvider

            .state('router', {
                url        : '/',
                templateUrl: path + '/splash/loading.html',
                controller : LoadingCtrl
            })


            .state('intro', {
                url        : '/intro',
                templateUrl: path + '/intro/intro.html',
                controller : 'IntroCtrl as vm'
            })

            .state('user', {
                url        : '/user',
                abstract: true,
                templateUrl: path + '/user/user.tabs.html'
            })

            .state('user.signin', {
                url  : '/signin',
                views: {
                    tabLogin: {
                        controller : 'UserSigninCtrl as vm',
                        templateUrl: path + '/user/signin/user.signin.html'
                    }
                }
            })

            .state('user.signup', {
                url  : '/signup',
                views: {
                    tabLogin: {
                        controller : 'UserSignupCtrl as vm',
                        templateUrl: path + '/user/signup/user.signup.html'
                    }
                }
            })

            .state('useravatar', {
                url        : '/avatar',
                controller: 'UserAvatarCtrl as vm',
                templateUrl: path + '/user/profile/user.avatar.html'
            })


            .state('usermerge', {
                url        : '/merge',
                controller: 'UserMergeCtrl as vm',
                templateUrl: path + '/user/friend/user.merge.html'
            })

            .state('logout', {
                url       : '/logout',
                template: '<ion-view view-title="Logout" cache-view="false"><ion-content></ion-content></ion-view>',
                controller: LogoutCtrl
            });

        $urlRouterProvider.otherwise('/');

        function LoadingCtrl($rootScope, $state) {
            var user = $rootScope.user;
            console.log('User', user);

            if (user) {
                console.log(user);
                if (user.name) {
                    $state.go(AppConfig.routes.home, {
                        clear: true
                    });
                } else {
                    $state.go('useravatar', {
                        clear: true
                    });
                }
            } else {
                $state.go('intro', {
                    clear: true
                });
            }
        }

        function LogoutCtrl(User) {
            User.logout();
        }

    }

})(window, window.angular);
