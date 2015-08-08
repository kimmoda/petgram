'use strict';
angular
    .module ('module.gallery')
    .config (function ($stateProvider) {
    $stateProvider
        .state ('gallery', {
        url        : '/gallery',
        abstract   : true,
        templateUrl: 'module/gallery/view/gallery.tabs.html'
    })
        .state ('gallery.home', {
        url  : '/home/:reload',
        views: {
            tabHome: {
                controller : 'GalleryHomeCtrl as GalleryHome',
                templateUrl: 'module/gallery/view/gallery.home.html'
            }
        }
    })
        .state ('gallery.photo', {
        url  : '/home/:id',
        views: {
            tabHome: {
                controller : 'GalleryPhotoCtrl as GalleryPhoto',
                templateUrl: 'module/gallery/view/gallery.photo.html'
            }
        }
    })

        .state ('gallery.search', {
        url  : '/search',
        views: {
            tabSearch: {
                controller : 'GallerySearchCtrl as GallerySearch',
                templateUrl: 'module/gallery/view/gallery.search.html'
            }
        }
    })

        .state ('gallery.capture', {
        url  : '/capture',
        views: {
            tabCapture: {
                controller : 'GalleryCaptureCtrl as GalleryCapture',
                templateUrl: 'module/gallery/view/gallery.capture.html'
            }
        }
    })

        .state ('gallery.notify', {
        url  : '/notify',
        views: {
            tabNotify: {
                controller : 'GalleryNotifyCtrl as GalleryNotify',
                templateUrl: 'module/gallery/view/gallery.notify.html'
            }
        }
    })

        .state ('gallery.profile', {
        url     : '/profile',
        abstract: true,
        views   : {
            tabProfile: {
                //controller : 'GalleryProfileCtrl as GalleryProfile',
                templateUrl: 'module/gallery/view/gallery.profile.tabs.html'
            }
        }
    })
        .state ('gallery.settings', {
        url  : '/settings',
        views: {
            tabProfile: {
                //controller : 'GalleryProfileCtrl as GalleryProfile',
                templateUrl: 'module/gallery/view/gallery.profile.settings.html'
            }
        }
    })


        .state ('gallery.profile.photos', {
        url  : '/photos',
        views: {
            tabPhotos: {
                //controller : 'GalleryProfilePhotosCtrl as GalleryProfilePhotos',
                templateUrl: 'module/gallery/view/gallery.profile.photos.html'
            }
        }
    })

    ;
});
