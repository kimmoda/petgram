'use strict';
angular
    .module ('module.gallery')
    .config (function ($stateProvider) {
        $stateProvider
            .state ('app.galleries', {
                url  : '/galleries',
                views: {
                    menuContent: {
                        controller : 'GalleryListCtrl as GalleryList',
                        templateUrl: 'module/gallery/view/gallery.list.html'
                    }
                }
            })

            .state ('app.gallery', {
                url  : '/gallery/:id',
                views: {
                    menuContent: {
                        controller : 'GalleryViewCtrl as GalleryPreview',
                        templateUrl: 'module/gallery/view/gallery.view.html'
                    }
                }
            })
            .state ('app.gallerypreview', {
                url  : '/gallery/preview/:id',
                views: {
                    menuContent: {
                        resolve    : {
                            photo: function (Gallery, $stateParams) {
                                return Gallery
                                    .getPhoto ($stateParams.id)
                                    .then (function (resp) {
                                        return resp;
                                    });
                            }
                        },
                        controller : 'GalleryPreviewCtrl as GalleryPreview',
                        templateUrl: 'module/gallery/view/gallery.preview.html'
                    }
                }
            });
    });
