'use strict';
angular
    .module ('module.gallery')
    .factory ('PhotoService', function ($ionicActionSheet, $ionicPopup, $timeout, ImageService, ParseImageService, $window, $cordovaCamera, $cordovaImagePicker, ParseConfig, gettextCatalog, $http, $q) {


    function resizeTheImage (originalImageData) {

        return $window
        .imageResizer
        .resizeImage (function (data) {

            // console.log ('resizeImage success: ' + data.width + ' ' + data.height);
            // deferred.resolve (data.imageData);
            return data.imageData;

        }, function (error) {
            console.log ('Error : \r\n' + error);
            return error;
            // deferred.reject (error);
        }, originalImageData, 0, 200, { //200x200
            resizeType   : ImageResizer.RESIZE_TYPE_MAX_PIXEL,
            imageDataType: ImageResizer.IMAGE_DATA_TYPE_BASE64,
            pixelDensity : true,
            quality      : 50,
            //imageDataType: ImageResizer.IMAGE_DATA_TYPE_URL,
            photoAlbum   : 0,
            format       : 'jpg'
        });

    }

    function getGeoPosition () {
        console.log ('get location');
        var deferred = $q.defer ();
        navigator.geolocation.getCurrentPosition (function (position) {
            console.log (position.coords.latitude, position.coords.longitude);
            deferred.resolve (position);
        });
        return deferred.promise;
    }

    function _doTakePicture () {
        var originalImageData;
        var defer = $q.defer();

        var options = {
            quality           : ImageService.imageSettings ().quality,
            allowEdit         : ImageService.imageSettings ().allowEdit,
            correctOrientation: ImageService.imageSettings ().allowEdit ? false : true,
            targetWidth       : ImageService.imageSettings ().dimensions,
            saveToPhotoAlbum  : ImageService.imageSettings ().saveToAlbum,
            destinationType   : Camera.DestinationType.DATA_URL,
            sourceType        : Camera.PictureSourceType.CAMERA,
            encodingType      : Camera.EncodingType.JPEG,
            //targetHeight: ImageService.imageSettings().dimensions,
            //popoverOptions: CameraPopoverOptions,
        };

        $cordovaCamera
            .getPicture (options)
            .then (function (imageData) {
                // Success! Image data is here
                console.log ('Success! Image data is here ');
                // originalImageData = imageData;
                return imageData;
                return resizeTheImage (originalImageData);
            })
            // .then (function (resizedImageData) {
            //
            //     console.log ('Trying to save everything');
            //
            //     return ({
            //         thumbBase64: resizedImageData,
            //         photo      : originalImageData
            //     });
            //
            //     // return ParseImageService.save ({
            //     //     thumbBase64: resizedImageData,
            //     //     photo      : originalImageData
            //     // });
            // })
            .then (function (data) {
                // $timeout ($scope.imageList = _data, 0);
                  console.log('resolve')
                  defer.resolve(data);
            })
            .catch(function (err) {
                // An error occured. Show a message to the user
                // console.log ('Error When taking Photo ' + err);
                defer.reject('Error When taking Photo:' + err)
            });
            return defer.promise;
    }

    function upload (imageData, name) {
        var defer = $q.defer ();

        console.log (imageData);

        if (imageData) {
            var parseFile = new Parse.File ('photo.jpg', {base64: imageData});
            parseFile
                .save (function () {
                console.log (parseFile);

                var gallery = new Parse.Object ('Gallery');
                gallery.set ('title', 'teste');
                gallery.set ('body', 'descricao');
                gallery.set ('img', parseFile);
                gallery.save (function (resp) {
                    console.log (resp);
                    defer.resolve (resp);
                });
            })
        } else {
            defer.reject ('no file');
        }


        return defer.promise;
    }

    function capture (type) {
        var defer = $q.defer ();
        if (type === 0) {

          _doTakePicture()
          .then(function(data){
            defer.resolve(data);
          })
          .catch(function(err){
            defer.reject(err);
          });

        }

        if (type === 1) {
            var options = {
                maximumImagesCount: 1,
                width             : 150,
                height            : 150,
                quality           : 80
            };

            $cordovaImagePicker
                .getPictures (options)
                .then (function (results) {
                defer.resolve (results[0]);
            }, function (error) {
                // error getting photos
                defer.reject (error);
            });
        }
        return defer.promise;
    }


    function open (type, name) {
        var defer = $q.defer ();
        $ionicActionSheet.show ({
            buttons      : [
                {text: '<i class="icon ion-ios-camera"></i>' + gettextCatalog.getString ('Foto da Camera')},
                {text: '<i class="icon ion-images"></i>' + gettextCatalog.getString ('Foto da Galeria')}
            ],
            //destructiveText: 'Delete',
            titleText    : gettextCatalog.getString ('Enviar Foto'),
            cancelText   : gettextCatalog.getString ('Cancelar'),
            cancel       : function () {
                // add cancel code..
                defer.reject('Cancel');
            },
            buttonClicked: function (index) {
                console.log (index);

                capture (index)
                    .then (function (resp) {
                    defer.resolve (resp);
                })
                    .catch (function (resp) {
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
