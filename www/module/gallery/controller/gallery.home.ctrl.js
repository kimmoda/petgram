'use strict';
angular
    .module ('module.gallery')
    .controller ('GalleryHomeCtrl', function ($scope, PhotoService, Gallery, Notify) {
    var self = this;

    self.load = function (force) {
        Gallery
            .all (force)
            .then (function (resp) {
            self.data = resp;
            $scope.$broadcast ('scroll.infiniteScrollComplete');
        });
    };

    self.upload = function () {
        PhotoService
            .open()
            .then(function (resp) {
                console.log (resp);
            });
    };

    self.load ();

});
