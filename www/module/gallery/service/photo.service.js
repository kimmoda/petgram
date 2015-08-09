'use strict';
angular
    .module ('module.gallery')
    .factory ('PhotoService', function ($ionicActionSheet, $window, $ionicPopup, GallerySetting, $cordovaCamera, $cordovaImagePicker, gettextCatalog, $q, Notify) {

    function capture (type) {
        var defer = $q.defer ();

        var options = {
            quality           : GallerySetting.get ('imageQuality'),
            allowEdit         : GallerySetting.get ('imageEdit'),
            correctOrientation: GallerySetting.get ('imageEdit'),
            targetWidth       : GallerySetting.get ('imageWidth'),
            targetHeight      : GallerySetting.get ('imageHeight'),
            saveToPhotoAlbum  : GallerySetting.get ('imageSaveAlbum'),
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

                if ($window.cordova) {
                    capture (index)
                        .then (function (resp) {
                        actionSheet ();
                        defer.resolve (resp);
                    })
                        .catch (function (resp) {
                        actionSheet ();
                        defer.reject (resp);
                    });
                } else {
                    Notify.alert ({
                        title: 'Camera indisponivel',
                        text : 'Habilite a camera no seu dispositivo'
                    });
                    actionSheet ();
                    defer.reject ('Camera not disponible');
                }


            }
        });
        return defer.promise;
    }

    return {
        open: open
    }


});