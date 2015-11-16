(function (window, angular, ionic, undefined) {
    'use strict';
    angular
        .module('ion-photo', [
            'ionic',
            'ngCordova',
            'gettext',
            'jrCrop'
        ])
        .factory('PhotoService', PhotoService)
        // Photo Crop
        .directive('ionCrop', ionCropDirective)

        // Photo Filter
        .factory('PhotoFilter', PhotoFilterFactory)
        .directive('caman', camanDirective)
        .directive('photoFilter', photoFilterDirective)
        .directive('photoCarousel', photoFilterCarouselDirective)
        .factory('CamanJs', CamanJs)
    ;

    // TODO: options (size, crop, filter)
    // TODO: alert photo picker or gallery
    // TODO: crop photo
    // TODO: filter
    // TODO: return photo

    function PhotoService ($ionicActionSheet, $jrCrop, $rootScope, $ionicModal, $cordovaCamera, gettextCatalog, $q, Notify) {

        var setting = {
            quality: 80,
            allowEdit: false,
            filter: false,
            correctOrientation: true,
            targetWidth: 640,
            targetHeight: 640,
            saveToPhotoAlbum: false,
        };

        if (window.cordova) {
            var options = {
                quality: setting.quality,
                allowEdit: setting.allowEdit,
                correctOrientation: setting.correctOrientation,
                targetWidth: setting.targetWidth,
                targetHeight: setting.targetHeight,
                saveToPhotoAlbum: setting.saveToPhotoAlbum,
                destinationType: Camera.DestinationType.DATA_URL,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions,
            };
        } else {
            var options;
        }

        return {
            open: open
        };

        function open (done) {
            var defer       = $q.defer();
            var buttons     = [
                {
                    text: '<i class="icon ion-ios-camera"></i>' + gettextCatalog.getString('Camera')
                },
                {
                    text: '<i class="icon ion-images"></i>' + gettextCatalog.getString('Gallery')
                }
            ];
            var actionSheet = $ionicActionSheet.show({
                buttons: buttons,
                titleText: gettextCatalog.getString('Share Photo'),
                cancelText: gettextCatalog.getString('Cancel'),
                cancel: buttonCancel,
                buttonClicked: buttonClicked
            });

            function buttonClicked (index) {
                console.log(index);

                if (window.cordova) {
                    capture (index, options)
                        .then(cropImage)
                        .catch(buttonCancel);
                } else {
                    Notify.alert({
                        title: gettextCatalog.getString('Error'),
                        text: gettextCatalog.getString('Enabled your camera')
                    });
                    buttonCancel ();
                }
            }

            function cropImage (image) {
                actionSheet ();
                $jrCrop
                    .crop({
                        //url: image,
                        url: 'data:image/jpeg;base64,' + image,
                        width: options.targetWidth,
                        height: options.targetHeight,
                        cancelText: gettextCatalog.getString('Cancel'),
                        chooseText: gettextCatalog.getString('Save')
                    })
                    .then(filter)
                    .catch(buttonCancel);
            }

            function buttonCancel (resp) {
                actionSheet ();
                defer.reject(resp);
            }

            return defer.promise;
        }

        function filter (image, done) {
            var template = '<ion-modal-view class="modal-capture"><ion-header-bar class="bar-dark"><button class="button button-clear button-icon ion-ios-arrow-thin-left"ng-click="closeCapture()"></button><div class="title">{{ \'Filters\' | translate }}</div><button class="button button-icon " ng-click="submitCapture()"><i class="icon ion-arrow-right-b"></i></button></ion-header-bar><ion-content><photo-filter image="form.photo"></photo-filter></ion-content></ion-modal-view>';
            image        = image.toDataURL();

            var scope           = $rootScope.$new(true);
            scope.closeCapture  = closeModalCapture;
            scope.submitCapture = submitCapture;
            scope.form          = {
                photo: image
            };

            scope.modal = $ionicModal.fromTemplate(template, {
                scope: scope
            });

            scope.modal.show();


            function submitCapture () {
                var canvas  = window.document.getElementById('image');
                var dataUrl = canvas.toDataURL();
                //console.log(dataUrl);
                done (dataUrl);
            }

            function closeModalCapture () {
                scope.modal.hide();
            }

        }


        function capture (type) {
            var defer = $q.defer();

            // CAMERA
            if (type === 0) {
                options.sourceType = Camera.PictureSourceType.CAMERA;
            }

            // GALLERY
            if (type === 1) {
                options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
            }

            console.log(options);

            $cordovaCamera
                .getPicture(options)
                .then(function (imageData) {
                    defer.resolve(imageData);
                }, function (err) {
                    defer.reject('Error When taking Photo:' + err);
                });
            return defer.promise;
        }
    }

    // jrCrop
    function ionCropDirective ($jrCrop, $ionicActionSheet, gettextCatalog) {

        return {
            restrict: 'A',
            scope: {
                ngModel: '=',
                option: '=',
                cropSave: '&'
            },
            template: '<div><input type="file" id="browseBtn" image="image" accept="image/*" style="display: none"/></div>',
            link: ionCropLink
        };

        function ionCropLink ($scope, element) {

            // Triggered on a button click, or some other target
            $scope.action = action;
            element.bind('click', getElem);
            $scope.crop = crop;
            angular.element(document.getElementById('browseBtn'))
                   .on('change', fileUpload);


            function getElem () {
                document.getElementById('browseBtn')
                        .click();
            }

            function action () {

                // Show the action sheet
                $ionicActionSheet.show({
                    buttons: [
                        {
                            text: '<i class="icon ion-camera"></i>' + gettextCatalog.getString('Photo Camera')
                        },
                        {
                            text: '<i class="icon ion-images"></i> ' + gettextCatalog.getString('Photo Album')
                        }
                    ],
                    //destructiveText: gettextCatalog.getString ('Delete'),
                    titleText: gettextCatalog.getString('Change Image'),
                    cancelText: gettextCatalog.getString('Cancel'),
                    cancel: function () {
                        // add cancel code..
                    },
                    buttonClicked: function (index) {

                        if (index === 0) {
                            console.log('Photo Camera');
                        }
                        // Photo Album
                        if (index === 1) {
                            document.getElementById('browseBtn')
                                    .click();
                        }
                        return true;
                    }
                });

            }

            function fileUpload (e) {

                var file   = e.target.files[0];
                var reader = new FileReader ();
                reader.readAsDataURL(file);

                reader.onload = function (event) {
                    var image = event.target.result;
                    $scope.crop(image);
                };

                // Clear input file
                angular.element(document.getElementById('browseBtn'))
                       .val('');

            }

            function crop (image) {

                $jrCrop
                    .crop({
                        url: image,
                        width: $scope.option ? $scope.option.width : 200,
                        height: $scope.option ? $scope.option.height : 200,
                        cancelText: gettextCatalog.getString('Cancel'),
                        chooseText: gettextCatalog.getString('Save')
                    })
                    .then(function (canvas) {
                        var image = canvas.toDataURL();
                        //            var name = $scope.option ? $scope.option.name : 'thumb';
                        //            var filename = ($scope.option ? $scope.option.name : '') + '_' + name + window.Number(new window.Date() + '.jpg';

                        //var file = base64ToBlob(image.replace('data:image/png;base64,', ''), 'image/jpeg');
                        //            file.name = filename;

                        //upload(file);

                        console.log(image);
                        $scope.ngModel = image;


                    });

            }
        }
    }

    // Photo Filter
    function PhotoFilterFactory ($rootScope, $q, $ionicModal) {

        return {
            load: load
        };

        function load (image, done) {
            var template = '<ion-modal-view class="modal-capture"><ion-header-bar class="bar-dark"><button class="button button-clear button-icon ion-ios-arrow-thin-left"ng-click="closeCapture()"></button><div class="title text-left">{{ \'Filters\' | translate }}</div><button class="button button-clear button-icon ion-ios-arrow-thin-right"ng-click="submitCapture()"></button></ion-header-bar><ion-content><photo-filter image="form.photo"></photo-filter></ion-content></ion-modal-view>';
            var image    = image.toDataURL();

            var scope           = $rootScope.$new(true);
            scope.closeCapture  = closeModalCapture;
            scope.submitCapture = submitCapture;
            scope.form          = {
                photo: image
            };

            scope.modal = $ionicModal.fromTemplate(template, {
                scope: scope
            });

            scope.modal.show();


            function submitCapture () {
                var canvas  = window.document.getElementById('image');
                var dataUrl = canvas.toDataURL();
                console.log(dataUrl);
                done (dataUrl)
            }

            function closeModalCapture () {
                scope.modal.hide();
            }

        }

    }

    function photoFilterDirective () {
        return {
            restrict: 'E',
            scope: {
                image: '='
            },
            transclude: true,
            template: '<div class="capture-photo"> <div caman filter="\'normal\'" class="image" ng-class="{disabled: loading}" name="image" image="image"></div>  <ion-spinner ng-show="loading"></ion-spinner></div><photo-carousel image="image" loading="loading"></photo-carousel>'
        };
    }

    function photoFilterCarouselDirective (CamanJs) {
        return {
            restrict: 'E',
            scope: {
                image: '=',
                loading: '='
            },
            template: '<div class="wide-as-needed"> <a ng-repeat="filter in filters" ng-click="applyFilter(\'image\', filter)" > <div class="image" caman ng-class="{disabled: loading}" loading="loading" filter="filter" image="image" name="image{{ $index }}"></div> <ion-spinner ng-if="loading" ></ion-spinner>  <p>{{ filter }}</p> </a> </div>',
            link: function ($scope, elem) {
                $scope.filters     = CamanJs.filters;
                $scope.applyFilter = applyFilter;
                function applyFilter (elem, effect) {
                    $scope.loading = true;
                    console.log('load');
                    CamanJs
                        .effect(elem, effect, true)
                        .then(function (resp) {
                            $scope.loading = false;
                            console.log(resp);
                        });
                }
            }
        };
    }

    function camanDirective (CamanJs, $timeout) {
        return {
            restrict: 'A',
            scope: {
                filter: '=',
                name: '@',
                image: '=',
                loading: '='
            },
            template: '<img ng-src="{{ image }}" id="{{ name }}">',
            link: camanDirectiveLink
        };

        function camanDirectiveLink ($scope, elem) {
            console.log($scope.filter, $scope.name);
            $scope.loading = true;
            $timeout (function () {
                CamanJs
                    .effect($scope.name, $scope.filter)
                    .then(function () {
                        $scope.loading = false;
                    });
            }, 500);
        }
    }


    function CamanJs ($q) {
        var filters = [
            'normal',
            'vintage',
            'lomo',
            'clarity',
            'sinCity',
            'sunrise',
            'crossProcess',
            'orangePeel',
            'love',
            'grungy',
            'jarques',
            'pinhole',
            'oldBoot',
            'glowingSun',
            'hazyDays',
            'herMajesty',
            'nostalgia',
            'hemingway',
            'concentrate'
        ];

        return {
            filters: filters,
            effect: filter,
            reset: resetEffect
        };

        function filter (elem, effect, status) {
            var defer = $q.defer();
            var image = window.document.getElementById(elem);

            var css = 'imgLoading';

            Caman (image, applyEffect);

            function applyEffect () {

                if (effect === 'normal') {
                    this.revert();
                    this.render(function () {
                        console.log('apply', elem, effect);
                        defer.resolve(effect);
                    });
                }

                if (effect in this) {
                    this[effect] ();
                    if (status) resetEffect (elem);
                    this.render(function () {
                        console.log('apply', elem, effect);
                        defer.resolve(effect);
                    });
                }
            }

            return defer.promise;
        }

        function resetEffect (elem) {

            var defer = $q.defer();
            var image = window.document.getElementById(elem);
            Caman (image, resetCaman);
            function resetCaman () {
                this.revert();
                defer.resolve(true);
            }

            return defer.promise;
        }
    }
}) (window, window.angular, window.ionic);
