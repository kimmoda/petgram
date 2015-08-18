'use strict';
angular
    .module('module.gallery')
    .controller('GalleryCaptureCtrl', function ($scope, User, $ionicModal, PhotoService, ParseImageService, $state, Gallery, Notify) {

        $scope.map = {
            center: {
                center: {
                    latitude : 45,
                    longitude: -73
                },
                zoom  : 13
            }
        };

        function init() {
            $scope.form = {
                title   : '',
                location: '',
                photo   : '',
                geo     : false
            };

            $scope.data    = '';
        }

        function getLocation() {

            if ($scope.form.location === '') {
                User
                    .location()
                    .then(function (position) {

                        $scope.here          = position;
                        $scope.form.location = position;
                        $scope.map.center    = position;
                        $scope.loading = false;

                        console.log($scope.form);
                        console.log($scope.here);
                        console.log(position);
                    }, function (err) {
                        // error
                        console.log(err);
                    });
            }


        };


        $scope.getGeo = function (resp) {
            if (resp) getLocation();
        };

        $scope.formFields      = Gallery.form;
        $scope.formShareFields = Gallery.formShare;

        $scope.open = function () {
            init();
            PhotoService
                .open()
                .then(function (resp) {
                    $scope.form.photo = resp;
                    $scope.data       = 'data:image/jpeg;base64,' + resp;

                    Notify.showLoading();

                    $ionicModal.fromTemplateUrl('module/gallery/view/gallery.capture.modal.html', {
                        scope: $scope
                    }).then(function (modal) {
                        $scope.modal = modal;
                        $scope.modal.show();
                        Notify.hideLoading();
                    });

                    $scope.closeModal = function () {
                        $scope.modal.hide();
                        $scope.modal.remove();
                    };
                })
                .catch(function () {
                    $state.go('gallery.home');
                });
        };

        $scope.open();

        $scope.submitCapture = function (form) {
            var dataForm  = angular.copy($scope.form);
            var shareForm = angular.copy($scope.formShare);
            console.log(shareForm);
            Notify.showLoading();
            Gallery
                .add(dataForm)
                .then(function (resp) {
                    $state.go('gallery.home', {
                        reload: true
                    });
                    $scope.closeModal();
                    init();
                    Notify.hideLoading();
                });
        };


    });