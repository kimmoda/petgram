(function (window, angular, undefined) {
    'use strict';
    angular
        .module('app.photogram')
        .controller('PhotogramCaptureCtrl', PhotogramCaptureCtrl);

    function PhotogramCaptureCtrl($scope, AppConfig, User, $ionicModal, PhotoService, PhotogramSetting, $state, Photogram,
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

        vm.post = postImage;

        function init() {
            vm.form = {
                title: '',
                geo: {},
                photo: ''
            };

            vm.data = '';
        }

        function getLocation() {

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

        function getGeo(resp) {
            if (resp) getLocation();
        }

        function open() {
            init();
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
                .then(postImage)
                .catch(goHome);
        }

        function goHome() {
            $state.go('photogram.home');
        }

        function applyFilter(elem, effect) {
            CamanJs
                .effect(elem, effect, true)
                .then(function (resp) {
                    console.log(resp);
                });
        }

        function postImage(resp) {

            //$scope.data = 'data:image/jpeg;base64,' + resp;

            if (resp === '') return false;

            $scope.data = resp;
            $scope.closeModal = closeModal;
            $scope.filters = CamanJs.filters;
            $scope.applyFilter = applyFilter;
            $scope.form = {
                photo: resp
            };

            $ionicModal
                .fromTemplateUrl(path + '/capture/photogram.capture.modal.html', {
                    scope: $scope,
                    focusFirstInput: true
                }).then(function (modal) {
                vm.modal = modal;
                vm.modal.show();
            });

            function closeModal() {
                vm.modal.hide();
                vm.modal.remove();
            }
        }

        function submitCapture() {
            var dataForm = angular.copy(vm.form);
            var shareForm = angular.copy(vm.formShare);

            console.log(vm.form);
            if (vm.form.geo) {
                dataForm.location = vm.form.geo.coords;
            }

            console.log(shareForm);
            Loading.start();

            Photogram
                .add(dataForm)
                .then(function (resp) {
                    $state.go('photogram.home', {
                        reload: true
                    });
                    vm.closeModal();
                    init();
                    Loading.end();
                });
        }

    }

})(window, window.angular);