'use strict';
angular
    .module ('module.user')
    .controller ('IntroCtrl', function (User, $cordovaFacebook, gettextCatalog, $state, $scope, Notify, $ionicSlideBoxDelegate, $rootScope) {
    var self = this;

    $scope.slides = [
        {
            title   : 'App screenshot',
            class: 'background-positive',
            img  : 'img/device-airbnb.png'
        },

        {title   : 'Facebook paper screenshot',
            class: 'background-calm',
            img  : 'img/device-facebook-paper.png'
        },

        {title   : 'Foursquare screenshot',
            class: 'background-balanced',
            img  : 'img/device-foursquare.png'
        },
        {title   : 'Instagram screenshot',
            class: 'background-energized',
            img  : 'img/device-instagram.png'
        },
        {title   : 'Twitter screenshot',
            class: 'background-royal',
            img  : 'img/device-twitter.png'
        }
    ];

    $scope.slideIndex = 0;

    $scope.nextSlide     = function () {
        $ionicSlideBoxDelegate.next ();
    };
    $scope.previousSlide = function () {
        $ionicSlideBoxDelegate.previous ();
    };

    // Called each time the slide changes
    $scope.slideChanged = function (index) {
        $scope.slideIndex = index;
    };

    var currentPlatform = ionic.Platform.platform ();

    console.log (currentPlatform);

    if (currentPlatform) {
        $scope.device = (currentPlatform == 'android') ? 'nexus6' : 'iphone6';

    } else {
        $scope.device = 'nexus6';
    }

})
;
