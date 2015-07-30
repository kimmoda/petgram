'use strict';
angular
    .module ('module.gallery')
    .controller ('GalleryListCtrl', function ($scope, CONST, $window, $cordovaImagePicker, $cordovaCamera, Gallery) {
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
        var options = {
            quality         : 75,
            destinationType : Camera.DestinationType.FILE_URI,
            sourceType      : Camera.PictureSourceType.PHOTOLIBRARY,
            //sourceType      : Camera.PictureSourceType.CAMERA,
            popoverOptions  : CameraPopoverOptions,
            encodingType    : Camera.EncodingType.JPEG,
            allowEdit       : true,
            targetWidth     : 100,
            targetHeight    : 100,
            saveToPhotoAlbum: false
        };

        $cordovaCamera
            .getPicture (options)
            .then (function (imageData) {
            console.log (imageData);

            Gallery
                .upload ('teste', imageData)
                .then (function (resp) {
                console.log (resp);
            });
            //$scope.avatar = "data:image/jpeg;base64," + imageData;
            //$rootScope.user.img = imageData;
        }, function (err) {
            console.log (err);
        });
    }

    self.load ();

});
