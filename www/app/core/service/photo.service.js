'use strict';
angular
    .module ('module.core')
    .factory ('PhotoService', function ($ionicActionSheet, $cordovaCamera, $cordovaImagePicker, CONST, gettextCatalog, $http, $q) {

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
            var options = CONST.CAMERA;

            console.log ('Capturar Foto');

            $cordovaCamera
                .getPicture (options)
                .then (function (imageData) {
                console.log (imageData);
                //$scope.avatar = "data:image/jpeg;base64," + imageData;
                defer.resolve (imageData);
            }, function (err) {
                console.log (err);
                defer.reject (err);
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
                //$scope.avatar = results[0];
                //for (var i = 0; i < results.length; i++) {
                //    console.log ('Image URI: ' + results[i]);
                //}
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
            },
            buttonClicked: function (index) {
                console.log (index);

                capture (index)
                    .then (function (imageData) {
                    upload (imageData, name)
                        .then (function (resp) {
                        defer.resolve (resp);
                    })
                        .catch (function (resp) {
                        defer.reject (resp);
                    });
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