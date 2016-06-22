(function () {
    'use strict';

    angular.module('app.main').controller('WalkthroughCtrl', WalkthroughController);

    function WalkthroughController($ionicSlideBoxDelegate, $scope, $ionicPlatform, $cordovaSplashscreen) {
        var vm              = this;
        var currentPlatform = window.ionic.Platform.platform();
        vm.slideIndex       = 0;

        vm.slideChanged = function (index) {
            vm.slideIndex = index;
        };
        vm.next         = function () {
            $ionicSlideBoxDelegate.next();
        };
        vm.previous     = function () {
            $ionicSlideBoxDelegate.previous();
        };

        if (currentPlatform) {
            vm.device = (currentPlatform === 'android') ? 'android' : 'iphone';
        } else {
            vm.device = 'android';
        }

        vm.slides                          = [{
            text: 'STEP1',
            img : 'img/intro1.jpg'
        }, {
            text: 'STEP2',
            img : 'img/intro2.jpg'
        }, {
            text: 'STEP3',
            img : 'img/intro3.jpg'
        }, {
            text: 'STEP4',
            img : 'img/intro4.jpg'
        }, {
            text: 'STEP5',
            img : 'img/intro5.jpg'
        }
        ];
        window.localStorage['walkthrough'] = true;

        $scope.$on('$ionicView.loaded', function () {
            $ionicPlatform.ready(function () {
                if (navigator && navigator.splashscreen) {
                    $cordovaSplashscreen.hide();
                    window.StatusBar.styleDefault();
                }
            });
        });

    }

})();
