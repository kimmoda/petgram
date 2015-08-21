(function(){
    'use strict';
    angular
        .module('module.user')
        .controller('IntroCtrl', function (User, $cordovaFacebook, gettextCatalog, $state, $scope, Notify, $ionicSlideBoxDelegate, $rootScope) {
            var vm = this;

            $scope.slides = [
                {
                    title: 'App screenshot',
                    class: 'background-positive',
                    img  : 'img/intro1.png'
                },

                {
                    title: 'Facebook paper screenshot',
                    class: 'background-positive',
                    img  : 'img/intro2.png'
                },

                {
                    title: 'Foursquare screenshot',
                    class: 'background-positive',
                    img  : 'img/intro3.png'
                },
                {
                    title: 'Instagram screenshot',
                    class: 'background-positive',
                    img  : 'img/intro4.png'
                }
            ];

            $scope.slideIndex = 0;

            $scope.nextSlide     = function () {
                $ionicSlideBoxDelegate.next();
            };
            $scope.previousSlide = function () {
                $ionicSlideBoxDelegate.previous();
            };

            // Called each time the slide changes
            $scope.slideChanged = function (index) {
                $scope.slideIndex = index;
            };

            var currentPlatform = ionic.Platform.platform();

            console.log(currentPlatform);

            if (currentPlatform) {
                $scope.device = (currentPlatform == 'android') ? 'nexus6' : 'iphone6';

            } else {
                $scope.device = 'nexus6';
            }

        })
    ;
})();