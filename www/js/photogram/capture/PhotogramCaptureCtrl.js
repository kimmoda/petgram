(function(window, angular, undefined){
    'use strict';
    /**
 * @ngdoc controller
 * @name PhotogramCaptureCtrl
 *
 * @description
 * _Please update the description and dependencies._
 *
 * @requires $scope
 * */
    angular
    .module('app.photogram')
        .controller('PhotogramCaptureCtrl', PhotogramCaptureController);

    function PhotogramCaptureController ($scope, AppConfig, User, $ionicModal, PhotoService, PhotogramSetting, $state, Photogram,
                                   PhotogramForm, CamanJs, Loading) {
        var vm = this;
        var path = AppConfig.path;
        var map = {
            center: {
                center: {
                    latitude: 45,
                    longitude: -73
                },
                zoom: 13
            }
        };
        var option = {
            widht: 150,
            height: 150,
        };

        console.log(option);

        vm.map = map;
        vm.option = option;
        vm.getGeo = getGeo;
        vm.formFields = PhotogramForm.form;
        vm.formShareFields = PhotogramForm.formShare;
        vm.submitCapture = submitCapture;
        vm.post = modalImage;
        vm.share = modalShare;

        function init () {
            vm.form = {
                title: '',
                geo: {},
                photo: ''
            };

            vm.data = '';
        }

        function getLocation () {

            if (vm.form.location === '') {
                User
                    .location()
                    .then(function (position) {

                        vm.here = position;
                        vm.form.location = position;
                        vm.map.center = position;
                        vm.loading = false;

                        console.log(vm.form);
                        console.log(vm.here);
                        console.log(position);
                    }, function (err) {
                        // error
                        console.log(err);
                    });
            }

        }

        function getGeo (resp) {
            if (resp) getLocation ();
        }

        function open () {
            init ();
            var option = {
                quality: PhotogramSetting.get('imageQuality'),
                allowEdit: PhotogramSetting.get('imageEdit'),
                correctOrientation: PhotogramSetting.get('imageEdit'),
                targetWidth: PhotogramSetting.get('imageWidth'),
                targetHeight: PhotogramSetting.get('imageHeight'),
                saveToPhotoAlbum: PhotogramSetting.get('imageSaveAlbum')
            };

            PhotoService
                .open(option)
                .then(modalImage)
                .catch(goHome);
        }

        function goHome () {
            $state.go('photogram.home');
        }

        function applyFilter (elem, effect) {
            CamanJs
                .effect(elem, effect, true)
                .then(function (resp) {
                    console.log(resp);
                });
        }

        function modalImage (resp) {

            if (resp === '') return false;

            $scope.data = resp;
            $scope.filters = CamanJs.filters;
            $scope.closeCapture = closeModalCapture;
            $scope.applyFilter = applyFilter;
            $scope.submitCapture = submitCapture;
            $scope.form = {
                photo: resp
            };

            $ionicModal
                .fromTemplateUrl(path + '/capture/photogram.capture.modal.html', {
                    scope: $scope,
                    focusFirstInput: true
                })
                .then(function (modal) {
                    vm.modalCapture = modal;
                    vm.modalCapture.show();
                });

            function closeModalCapture () {
                vm.modalCapture.hide();
                vm.modalCapture.remove();
            }
        }

        function modalShare (image) {
            $scope.closeShare = closeModalShare;
            $scope.submitShare = submitShare;
            $scope.form = {
                title: '',
                location: '',
                photo: image,
                geo: false
            };
            $ionicModal
                .fromTemplateUrl(path + '/capture/photogram.share.modal.html', {
                    scope: $scope,
                    focusFirstInput: true
                })
                .then(function (modal) {
                    vm.modalShare = modal;
                    vm.modalShare.show();
                });

            function closeModalShare () {
                vm.modalShare.hide();
                vm.modalShare.remove();
            }
        }

        function submitShare () {
            var dataForm = angular.copy(vm.form);
            var shareForm = angular.copy(vm.formShare);

            console.log(vm.form);
            if (vm.form.geo) {
                dataForm.location = vm.form.geo.coords;
            }

            console.log(shareForm);
            Loading.start();

            return Photogram
                .add(dataForm)
                .then(function (resp) {
                    $state.go('photogram.home', {
                        reload: true
                    });
                    vm.closeModal();
                    init ();
                    Loading.end();
                });
        }

        function submitCapture () {
            var canvas = window.document.getElementById('image');
            var dataUrl = canvas.toDataURL();

            return modalShare (dataUrl);

        }

    }


})(window, window.angular);