(function () {
    'use strict';

    angular.module('app.main').controller('LoadingCtrl', LoadingController);

    function LoadingController($scope, $rootScope, $ionicPlatform, $cordovaSplashscreen, AppConfig, $state) {
        var user  = $rootScope.currentUser;
        var intro = window.localStorage['walkthrough'];

        if (intro !== 'true') {
            $state.go('walkthrough', {clear: true});
        } else {
            if (user) {
                console.log(user);
                if (user.name) {
                    $state.go(AppConfig.routes.home, {
                        clear: true
                    });
                } else {
                    $state.go('user.avatar', {
                        clear: true
                    });
                }
            } else {
                $state.go(AppConfig.routes.login, {
                    clear: true
                });
            }
        }

        $scope.$on('$ionicView.loaded', function () {
            $ionicPlatform.ready(function () {
                if (navigator && navigator.splashscreen) {
                    $cordovaSplashscreen.hide();
                }
            });
        });


    }


})();
