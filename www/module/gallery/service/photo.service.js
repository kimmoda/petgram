'use strict';
angular
    .module ('module.gallery')
    .factory ('PhotoService', function ($ionicActionSheet, $ionicPopup, Settings, $cordovaCamera, $cordovaImagePicker, gettextCatalog, $q) {

    function capture (type) {
        var defer = $q.defer ();

        var options = {
            quality           : Settings.settings ().quality,
            allowEdit         : Settings.settings ().allowEdit,
            correctOrientation: Settings.settings ().allowEdit,
            targetWidth       : Settings.settings ().width,
            targetHeight      : Settings.settings ().height,
            saveToPhotoAlbum  : Settings.settings ().saveToAlbum,
            destinationType   : Camera.DestinationType.DATA_URL,
            encodingType      : Camera.EncodingType.JPEG,
            popoverOptions    : CameraPopoverOptions,
        };


        // CAMERA
        if (type === 0) {
            options.sourceType = Camera.PictureSourceType.CAMERA;
        }

        // GALLERY
        if (type === 1) {
            options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
        }

        console.log (options);

        $cordovaCamera
            .getPicture (options)
            .then (function (imageData) {
            defer.resolve (imageData);
        }, function (err) {
            defer.reject ('Error When taking Photo:' + err)
        });
        return defer.promise;
    }


    function open () {
        var defer       = $q.defer ();
        var actionSheet = $ionicActionSheet.show ({
            buttons      : [
                {
                    text: '<i class="icon ion-ios-camera"></i>' + gettextCatalog.getString ('Camera')
                },
                {
                    text: '<i class="icon ion-images"></i>' + gettextCatalog.getString ('Gallery')
                }
            ],
            //destructiveText: 'Delete',
            titleText    : gettextCatalog.getString ('Send Photo'),
            cancelText   : gettextCatalog.getString ('Cancel'),
            cancel       : function () {
                defer.reject ('Cancel');
            },
            buttonClicked: function (index) {
                console.log (index);

                capture (index)
                    .then (function (resp) {
                    actionSheet ();
                    defer.resolve (resp);
                })
                    .catch (function (resp) {
                    actionSheet ();
                    defer.reject (resp);
                });

            }
        });
        return defer.promise;
    }

    return {
        open: open
    }


});