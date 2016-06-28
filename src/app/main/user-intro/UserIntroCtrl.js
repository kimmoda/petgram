(function () {
    'use strict';
    angular.module('starter').controller('UserIntroCtrl', UserIntroController);

    function UserIntroController($scope, $ionicPlatform, $cordovaSplashscreen) {
        var vm = this;
        $scope.$on('$ionicView.loaded', function () {
            $ionicPlatform.ready(function () {
                if (navigator && navigator.splashscreen) {
                    $cordovaSplashscreen.hide();
                    window.StatusBar.styleLightContent();
                }
            });
        });
    }

})();