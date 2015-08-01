'use strict';
angular
    .module ('module.gallery')
    .controller ('GalleryListCtrl', function ($scope, PhotoService, CONST, $window, $cordovaImagePicker, $cordovaCamera, Gallery) {
    var self = this;

    self.load = function (force) {
        Gallery
            .all (force)
            .then (function (resp) {
            console.log (resp);
            self.data = resp;
            $scope.$broadcast ('scroll.infiniteScrollComplete');
        });
    };

    self.upload = function () {
        //var options = CONST.CAMERA;
        PhotoService
            .open()
            .then(function (resp) {
                console.log (resp);
            });
    };

    self.load ();

});
