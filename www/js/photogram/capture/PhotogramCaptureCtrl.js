(function (window, angular, undefined) {
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
    
    function imageTo64 (image) {
        return 'data:image/jpeg;base64,' + image;
    }

    function PhotogramCaptureController ($scope, AppConfig, User, $ionicModal, PhotoService, PhotogramSetting, PhotogramShare, $state, Photogram,
                                         $jrCrop, PhotogramForm, gettextCatalog, PhotoFilter, Loading) {


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

        var socials = [
            {
                title: 'Instagram',
                checked: false
            },
            {
                title: 'Facebook',
                checked: false
            },
            {
                title: 'Twitter',
                checked: false
            },
            {
                title: 'whatsapp',
                checked: false
            }
        ];

        console.log(option);

        vm.map = map;
        vm.option = option;
        vm.getGeo = getGeo;
        vm.formFields = PhotogramForm.form;
        vm.formShareFields = PhotogramForm.formShare;
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
                allowEdit: false,
                correctOrientation: PhotogramSetting.get('imageEdit'),
                targetWidth: PhotogramSetting.get('imageWidth'),
                targetHeight: PhotogramSetting.get('imageHeight'),
                saveToPhotoAlbum: false
            };

            PhotoService
                .open(option)
                .then(modalShare)
                .catch(goHome);
        }

        //open (modalShare);

        function cropImage (image) {
            $jrCrop
                .crop({
                    url: image,
                    width: $scope.option ? $scope.option.width : 500,
                    height: $scope.option ? $scope.option.height : 500,
                    cancelText: gettextCatalog.getString('Cancel'),
                    chooseText: gettextCatalog.getString('Save')
                })
                .then(modalImage);
        }


        function goHome () {
            $state.go('photogram.home');
        }


        function modalImage (resp) {
            PhotoFilter.load(resp, modalShare)
        }


        function shareSocial (social, form) {
            return PhotogramShare
                .share(social,
                    {
                        text: form.title,
                        image: form.photo,
                        link: AppConfig.app.url
                    });
        }

        function modalShare (image) {
            $scope.closeShare = closeModalShare;
            $scope.submitShare = submitShare;
            $scope.share = shareSocial;
            $scope.socials = socials;
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

        }

        function closeModalShare () {
            vm.modalShare.hide();
            vm.modalShare.remove();
        }

        function submitShare (resp, social) {
            var form = angular.copy(resp);

            //if (vm.form.geo) {
            //    dataForm.location = vm.form.geo.coords;
            //}

            console.log(form);
            Loading.start();

            return Photogram
                .add(form)
                .then(function () {
                    $state.go('photogram.home', {
                        reload: true
                    });
                    closeModalShare();
                    init ();
                    Loading.end();
                });
        }



        angular.element(document.getElementById('browseBtn')).on('change', fileUpload);

        function fileUpload (e) {

            var file = e.target.files[0];
            var reader = new FileReader ();
            reader.readAsDataURL(file);

            reader.onload = function (event) {
                var image = event.target.result;
                console.log('cropImage', image);
                cropImage(image);
            };

            // Clear input file
            angular.element(document.getElementById('browseBtn')).val('');

        }

    }


}) (window, window.angular);
