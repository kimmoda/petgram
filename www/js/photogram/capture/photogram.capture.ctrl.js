(function (window, angular, undefined) {
    'use strict';
    angular
        .module('app.photogram')
        .controller('PhotogramCaptureCtrl', PhotogramCaptureCtrl);

    function PhotogramCaptureCtrl($scope, User, $ionicModal, PhotoService, PhotogramSetting, $state, Photogram,
                                  PhotogramForm, Loading) {

        var map = {
            center: {
                center: {
                    latitude : 45,
                    longitude: -73
                },
                zoom  : 13
            }
        };

        $scope.map = map;

        function init() {
            $scope.form = {
                title: '',
                geo  : {},
                photo: ''
            };

            $scope.data = '';
        }

        function getLocation() {

            if ($scope.form.location === '') {
                User
                    .location()
                    .then(function (position) {

                        $scope.here          = position;
                        $scope.form.location = position;
                        $scope.map.center    = position;
                        $scope.loading       = false;

                        console.log($scope.form);
                        console.log($scope.here);
                        console.log(position);
                    }, function (err) {
                        // error
                        console.log(err);
                    });
            }


        };


        $scope.getGeo = getGeo;

        function getGeo(resp) {
            if (resp) getLocation();
        }

        $scope.formFields      = PhotogramForm.form;
        $scope.formShareFields = PhotogramForm.formShare;

        $scope.open = open;

        $scope.open();

        $scope.submitCapture = submitCapture;

        function open() {
            init();
            PhotoService
                .open({
                    quality           : PhotogramSetting.get('imageQuality'),
                    allowEdit: PhotogramSetting.get('imageEdit'),
                    correctOrientation: PhotogramSetting.get('imageEdit'),
                    targetWidth       : PhotogramSetting.get('imageWidth'),
                    targetHeight      : PhotogramSetting.get('imageHeight'),
                    saveToPhotoAlbum  : PhotogramSetting.get('imageSaveAlbum')
                })
                .then(function (resp) {

                    $scope.data       = 'data:image/jpeg;base64,' + resp;
                    $scope.form.photo = resp;

                    $ionicModal.fromTemplateUrl('module/Photogram/view/photogram.capture.modal.html', {
                        scope          : $scope,
                        focusFirstInput: true
                    }).then(function (modal) {
                        $scope.modal = modal;
                        $scope.modal.show();
                    });

                    $scope.closeModal = function () {
                        $scope.modal.hide();
                        $scope.modal.remove();
                    };
                })
                .catch(function () {
                    $state.go('photogram.home');
                });
        }

        function submitCapture() {
            var dataForm  = angular.copy($scope.form);
            var shareForm = angular.copy($scope.formShare);

            console.log($scope.form);
            if ($scope.form.geo) {
                dataForm.location = $scope.form.geo.coords;
            }

            console.log(shareForm);
            Loading.start();

            Photogram
                .add(dataForm)
                .then(function (resp) {
                    $state.go('photogram.home', {
                        reload: true
                    });
                    $scope.closeModal();
                    init();
                    Loading.end();
                });
        }

    }

})(window, window.angular);