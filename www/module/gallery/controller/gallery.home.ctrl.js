'use strict';
angular
    .module ('module.gallery')
    .controller ('GalleryHomeCtrl', function ($scope, $stateParams, PhotoService, Gallery, Notify) {
        var self = this;

        self.load = function (force) {
            Gallery
                .all (force)
                .then (function (resp) {
                    self.data = resp;
                })
                .then (function () {
                    $scope.$broadcast ('scroll.refreshComplete');
                });
        };

        self.upload = function () {
            PhotoService
                .open ()
                .then (function (resp) {
                    console.log (resp);
                });
        };

        self.load ($stateParams.reload);

    });