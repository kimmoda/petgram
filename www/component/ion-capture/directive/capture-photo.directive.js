'use strict';
angular
    .module ('ion-capture')
    .directive ('capturePhoto', function ($ionicActionSheet, gettextCatalog, CONST, $cordovaCamera, $cordovaImagePicker) {
    return {
        restrict: 'A',
        scope   : {
            avatar: '='
        },
        link    : function ($scope, elem, attr) {


            function fotoCamera () {
                var options = CONST.CAMERA;

                console.log ('Capturar Foto');

                $cordovaCamera
                    .getPicture (options)
                    .then (function (imageData) {
                    console.log (imageData);
                    $scope.avatar = "data:image/jpeg;base64," + imageData;
                    //$rootScope.user.img = imageData;
                }, function (err) {
                    console.log (err);
                });
            }

            function fotoGaleria () {
                var options = {
                    maximumImagesCount: 1,
                    width             : 150,
                    height            : 150,
                    quality           : 80
                };

                $cordovaImagePicker.getPictures (options)
                    .then (function (results) {
                    $scope.avatar = results[0];
                    //for (var i = 0; i < results.length; i++) {
                    //    console.log ('Image URI: ' + results[i]);
                    //}
                }, function (error) {
                    // error getting photos
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
                                fotoCamera ();
                                return true;
                            case 1:
                                fotoGaleria ();
                                return true;
                            case 2:
                                return true;
                        }
                    }
                });

            });
        }
    }
});