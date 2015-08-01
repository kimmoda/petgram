'use strict';
angular
    .module ('module.gallery')
    .config (function ($stateProvider) {
    $stateProvider
        .state ('app.gallery', {
        url     : '/gallery',
        abstract: true,
        views   : {
            menuContent: {
                templateUrl: 'module/gallery/view/gallery.tabs.html'
            }
        }
    })
        .state ('app.gallery.home', {
        url  : '/home',
        views: {
            tabHome: {
                controller : 'GalleryHomeCtrl as GalleryHome',
                templateUrl: 'module/gallery/view/gallery.home.html'
            }
        }
    })

        .state ('app.gallery.feature', {
        url  : '/feature',
        views: {
            tabFeature: {
                controller : 'GalleryFeatureCtrl as GalleryFeature',
                templateUrl: 'module/gallery/view/gallery.feature.html'
            }
        }
    })

        .state ('app.gallery.capture', {
        url  : '/capture',
        views: {
            tabCapture: {
                controller : 'GalleryCaptureCtrl as GalleryCapture',
                templateUrl: 'module/gallery/view/gallery.capture.html'
            }
        }
    })

        .state ('app.gallery.notify', {
        url  : '/notify',
        views: {
            tabNotify: {
                controller : 'GalleryNotifyCtrl as GalleryNotify',
                templateUrl: 'module/gallery/view/gallery.notify.html'
            }
        }
    })

        .state ('app.gallery.profile', {
        url  : '/profile',
        views: {
            tabProfil: {
                controller : 'GalleryProfilCtrl as GalleryProfil',
                templateUrl: 'module/gallery/view/gallery.profile.html'
            }
        }
    })

    ;
});
