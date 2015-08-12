'use strict';
angular
    .module ('module.gallery')
    .config (function ($stateProvider) {
    $stateProvider

        .state ('userlist', {
        url        : '/users',
        controller : 'GalleryUserListCtrl as GalleryUserList',
        templateUrl: 'module/gallery/view/gallery.user.list.html'
    })


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

        .state ('gallery.profile', {
        url  : '/profile/:id',
        //abstract: true,
        views: {
            tabHome: {
                controller : 'GalleryProfileCtrl as GalleryProfile',
                templateUrl: 'module/gallery/view/gallery.profile.tabs.html'
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

        .state ('gallery.activity', {
        url  : '/activity',
        views: {
            tabActivity: {
                controller : 'GalleryActivityCtrl as GalleryActivity',
                templateUrl: 'module/gallery/view/gallery.activity.html'
            }
        }
    })

        .state ('gallery.account', {
        url  : '/account',
        views: {
            tabProfile: {
                controller : 'GalleryAccountCtrl as GalleryProfile',
                templateUrl: 'module/gallery/view/gallery.account.tabs.html'
            }
        }
    })

        //    .state ('gallery.profile.photosgrid', {
        //    url  : '/photosgrid',
        //    views: {
        //        tabProfile: {
        //            //controller : 'GalleryProfilePhotosCtrl as GalleryProfilePhotos',
        //            templateUrl: 'module/gallery/view/gallery.profile.photos.grid.html'
        //        }
        //    }
        //})
        //
        //    .state ('gallery.profile.photosList', {
        //    url  : '/photoslist',
        //    views: {
        //        tabProfile: {
        //            //controller : 'GalleryProfilePhotosCtrl as GalleryProfilePhotos',
        //            templateUrl: 'module/gallery/view/gallery.profile.photos.list.html'
        //        }
        //    }
        //})
        //
        //    .state ('gallery.profile.mpa', {
        //    url  : '/map',
        //    views: {
        //        tabProfile: {
        //            //controller : 'GalleryProfilePhotosCtrl as GalleryProfilePhotos',
        //            template: ''
        //        }
        //    }
        //})

    ;
});
