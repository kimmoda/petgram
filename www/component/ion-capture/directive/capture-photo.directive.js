'use strict';
angular
    .module ('ion-capture')
    .directive ('capturePhoto', function ($ionicActionSheet, gettextCatalog, $jrCrop, $cordovaCamera, $cordovaImagePicker) {

     function base64ToBlob (base64Data, contentType) {
            contentType = contentType || '';
            var sliceSize = 1024;
            var byteCharacters = atob (base64Data);
            var bytesLength = byteCharacters.length;
            var slicesCount = Math.ceil (bytesLength / sliceSize);
            var byteArrays = new Array (slicesCount);

            for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                var begin = sliceIndex * sliceSize;
                var end = Math.min (begin + sliceSize, bytesLength);

                var bytes = new Array (end - begin);
                for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                    bytes[i] = byteCharacters[offset].charCodeAt (0);
                }
                byteArrays[sliceIndex] = new Uint8Array (bytes);
            }
            return new Blob (byteArrays, {
                type: contentType
            });
    }


    return {
        restrict: 'A',
        scope   : {
            options: '=ionCaptureOptions',
            ionCaptureSave: '&'
        },
        link    : function ($scope, elem, attr) {

            function fail(err){
                console.error(err);
            }

            function finish (argument) {
                console.log(argument)
                $scope.ionCaptureSave(argument);
            }

            function getPhotoCamera () {
                var options = {
                  quality: 50,
                  destinationType: Camera.DestinationType.DATA_URL,
                  sourceType: Camera.PictureSourceType.CAMERA,
                  allowEdit: true,
                  encodingType: Camera.EncodingType.JPEG,
                  targetWidth: $scope.options.width || '250',
                  targetHeight: $scope.options.height || '250',
                  popoverOptions: CameraPopoverOptions,
                  saveToPhotoAlbum: false
                };

                console.log ('Capturar Foto');

                $cordovaCamera
                    .getPicture (options)
                    .then (finish, fail);
            }

            function getPhotoGallery () {
                var options = {
                      quality: 50,
                      destinationType: Camera.DestinationType.DATA_URL,
                      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                      allowEdit: true,
                      encodingType: Camera.EncodingType.JPEG,
                      targetWidth: $scope.options.width || '250',
                      targetHeight: $scope.options.height || '250',
                      popoverOptions: CameraPopoverOptions,
                      saveToPhotoAlbum: false
                    };

                $cordovaCamera
                    .getPicture (options)
                    .then (crop, fail);
            }

            function crop(image){

                console.log(image);

                 $jrCrop
                    .crop ({
                    url: image,
                    width:  $scope.options.width || 200,
                    height: $scope.options.height || 200,
                    cancelText: gettextCatalog.getString ('Cancelar'),
                    chooseText: gettextCatalog.getString ('Salvar')
                })
                    .then (function (canvas) {
                    var image = canvas.toDataURL ();
                    var name = $scope.cropOptions.name || 'thumb';
                    var filename = name + Number (new Date ()) + '.jpg';

                    var file = base64ToBlob (image.replace ('data:image/png;base64,', ''), 'image/jpeg');
                    file.name = filename;

                    console.log(file);
                    finish(file);
                });

            }

            elem.bind ('click', function () {

                // Show the action sheet
                var hideSheet = $ionicActionSheet.show ({
                    buttons      : [
                        {text: '<i class="icon ion-ios-camera"></i>' + gettextCatalog.getString ('Foto da Camera')},
                        {text: '<i class="icon ion-images"></i>' + gettextCatalog.getString ('Foto da Galeria')}
                    ],
                    //destructiveText: 'Delete',
                    titleText    : gettextCatalog.getString ('Enviar Foto'),
                    cancelText   : gettextCatalog.getString ('Cancelar'),
                    cancel       : function () {
                        // add cancel code..
                    },
                    buttonClicked: function (index) {
                        console.log (index);

                        switch (index) {
                            case 0:
                                getPhotoCamera ();

                                return true;
                            case 1:
                                getPhotoGallery ();
                                return true;
                        }
                    }
                });

            });
        }
    }
});
