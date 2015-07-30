'use strict';
angular
    .module ('module.miscellaneous')
    .config (function ($stateProvider) {
    $stateProvider
        //MISCELLANEOUS
        .state ('app.miscellaneous', {
        url  : '/miscellaneous',
        views: {
            menuContent: {
                templateUrl: 'module/miscellaneous/view/miscellaneous.html'
            }
        }
    })

        .state ('app.maps', {
        url  : '/miscellaneous/maps',
        views: {
            menuContent: {
                templateUrl: 'module/miscellaneous/view/maps.html',
                controller : 'MapsCtrl'
            }
        }
    })

        .state ('app.image-picker', {
        url  : '/miscellaneous/image-picker',
        views: {
            menuContent: {
                templateUrl: 'module/miscellaneous/view/image-picker.html',
                controller : 'ImagePickerCtrl'
            }
        }
    })

        .state ('app.slide-tab1', {
        url  : '/slide1',
        views: {
            menuContent: {
                templateUrl: 'module/miscellaneous/view/slide-tab1.html'
            }
        }
    })
        .state ('app.slide-tab2', {
        url  : '/slide1',
        views: {
            menuContent: {
                templateUrl: 'module/miscellaneous/view/slide-tab2.html'
            }
        }
    })
    ;
});