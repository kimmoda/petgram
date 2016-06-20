(function () {
    'use strict';
    angular
        .module('app.main')
        .controller('WalkthroughCtrl', WalkthroughController);

    function WalkthroughController($ionicSlideBoxDelegate, $translate) {
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

        vm.slides = [{
            top: $translate.instant('INTRO.STEP1'),
            img: 'img/intro1.jpg'
        }, {
            top: $translate.instant('INTRO.STEP2'),
            img: 'img/intro2.jpg'
        }, {
            top: $translate.instant('INTRO.STEP3'),
            img: 'img/intro3.jpg'
        }, {
            top: $translate.instant('INTRO.STEP4'),
            img: 'img/intro4.jpg'
        }, {
            top: $translate.instant('INTRO.STEP5'),
            img: 'img/intro5.jpg'
        }

        ];


        window.localStorage['walkthrough'] = true;

    }

})();
