(function () {
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
        .factory('VideoService', VideoService)
        .factory('CamanJs', CamanJs);

    function VideoService($window,$q) {
        var deferred = $q.defer();
        //https://devdactic.com/capture-and-store-videos-ionic/
        // Resolve the URL to the local file
        // Start the copy process
        function createFileEntry(fileURI) {
            $window.resolveLocalFileSystemURL(fileURI, function (entry) {
                return copyFile(entry);
            }, fail);
        }

        // Create a unique name for the videofile
        // Copy the recorded video to the app dir
        function copyFile(fileEntry) {
            var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
            var newName = makeid() + name;

            $window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (fileSystem2) {
                    fileEntry.copyTo(fileSystem2, newName, function (succ) {
                        return onCopySuccess(succ);
                    }, fail);
                },
                fail
            );
        }

        // Called on successful copy process
        // Creates a thumbnail from the movie
        // The name is the moviename but with .png instead of .mov
        function onCopySuccess(entry) {
            var name = entry.nativeURL.slice(0, -4);
            $window.PKVideoThumbnail.createThumbnail(entry.nativeURL, name + '.png', function (prevSucc) {
                return prevImageSuccess(prevSucc);
            }, fail);
        }

        // Called on thumbnail creation success
        // Generates the currect URL to the local moviefile
        // Finally resolves the promies and returns the name
        function prevImageSuccess(succ) {
            var correctUrl = succ.slice(0, -4);
            correctUrl += '.MOV';
            deferred.resolve(correctUrl);
        }

        // Called when anything fails
        // Rejects the promise with an Error
        function fail(error) {
            console.log('FAIL: ' + error.code);
            deferred.reject('ERROR');
        }

        // Function to make a unique filename
        function makeid() {
            var text = '';
            var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (var i = 0; i < 5; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }

        // The object and functions returned from the Service
        return {
            // This is the initial function we call from our controller
            // Gets the videoData and calls the first service function
            // with the local URL of the video and returns the promise
            saveVideo: function (data) {
                createFileEntry(data[0].localURL);
                return promise;
            }
        };
    }

    function PhotoService($ionicActionSheet, AppConfig, PhotogramShare, $jrCrop, $rootScope, $ionicModal,
                          $cordovaCamera, $cordovaCapture, gettextCatalog, $q, Notify) {

        // Default Setting
        var setting = {
            jrCrop: false,
            quality: 90,
            allowEdit: false,
            filter: true,
            correctOrientation: true,
            targetWidth: 300,
            targetHeight: 300,
            saveToPhotoAlbum: false,
            allowRotation: false,
            aspectRatio: 0
        };

        return {
            open: open,
            crop: cropModal,
            filter: filterModal,
            share: shareModal,
        };

        function open(option) {
            var defer = $q.defer();
            var options = {
                quality: option.quality ? option.quality : setting.quality,
                aspectRatio: option.aspectRatio ? option.aspectRatio : setting.aspectRatio,
                allowRotation: option.allowRotation ? option.allowRotation : setting.allowRotation,
                allowEdit: option.allowEdit ? option.allowEdit : setting.allowEdit,
                correctOrientation: option.correctOrientation ? option.correctOrientation : setting.correctOrientation,
                targetWidth: option.width ? option.width : setting.targetWidth,
                targetHeight: option.height ? option.height : setting.targetHeight,
                saveToPhotoAlbum: option.saveToPhotoAlbum ? option.saveToPhotoAlbum : setting.saveToPhotoAlbum,
                destinationType: window.cordova ? Camera.DestinationType.DATA_URL : null,
                encodingType: window.cordova ? Camera.EncodingType.JPEG : null,
                popoverOptions: window.cordova ? CameraPopoverOptions : null,
            };
            var buttons = [{
                text: '<i class="icon ion-ios-camera"></i>' + gettextCatalog.getString('Camera')
            }, {
                text: '<i class="icon ion-images"></i>' + gettextCatalog.getString('Gallery')
            }, {
                text: '<i class="icon ion-ios-videocam"></i>' + gettextCatalog.getString('Video')
            }];
            var actionSheet = $ionicActionSheet.show({
                buttons: buttons,
                titleText: gettextCatalog.getString('Share Photo'),
                cancelText: gettextCatalog.getString('Cancel'),
                cancel: buttonCancel,
                buttonClicked: buttonClicked
            });

            function buttonClicked(index) {
                console.log(index);

                if (window.cordova) {
                    capture(index, options)
                        .then(function (image) {
                            if (options.jrCrop) {
                                cropImage(image);
                            } else {
                                resolveImage(image);
                            }
                        })
                        .catch(buttonCancel);
                } else {
                    Notify.alert({
                        title: gettextCatalog.getString('Error'),
                        text: gettextCatalog.getString('Enabled your camera')
                    });
                    buttonCancel();
                }
            }

            function caputreVideo() {
                var defer = $q.defer();

                $cordovaCapture
                    .captureVideo({
                        limit: 3,
                        duration: 15
                    })
                    .then(defer.resolve)
                    .catch(defer.reject);

                return defer.promise;
            }

            function cropImage(image) {
                actionSheet();
                cropModal('data:image/jpeg;base64,' + image, options)
                    .then(res)
                    .catch(buttonCancel);
            }

            function resolveImage(resp) {
                console.log('resolved image');
                actionSheet();
                defer.resolve(resp);
            }

            function buttonCancel(resp) {
                actionSheet();
            }

            return defer.promise;
        }

        function cropModal(image, option) {
            var defer = $q.defer();
            $jrCrop
                .crop({
                    url: image,
                    aspectRatio: option.aspectRatio ? option.aspectRatio : false,
                    allowRotation: option.allowRotation ? option.allowRotation : false,
                    width: option.width ? option.width : setting.targetWidth,
                    height: option.height ? option.height : setting.targetHeight,
                    cancelText: gettextCatalog.getString('Cancel'),
                    chooseText: gettextCatalog.getString('Save')
                })
                .then(resolveImage);

            function resolveImage(canvas) {
                //var image = canvas.toDataURL();
                //            var name = $scope.option ? $scope.option.name : 'thumb';
                //            var filename = ($scope.option ? $scope.option.name : '') + '_' + name + window.Number(new window.Date() + '.jpg';

                //var file = base64ToBlob(image.replace('data:image/png;base64,', ''), 'image/jpeg');
                //            file.name = filename;

                //upload(file);

                defer.resolve(canvas);
            }

            return defer.promise;
        }

        function shareModal(post) {
            var template =
                '<ion-modal-view class="modal-share"> <ion-header-bar class="bar-dark"> <div class="title">{{ \'Share\' | translate }}</div> <button class="button button-positive" ng-click="modal.hide()"> <i class="icon ion-arrow-right-b"></i> </button> </ion-header-bar> <ion-content ng-cloak> <div id="image"> <img ng-src="{{form.photo}}"> <div class="title">{{ form.title }}</div></div> <ul class="list"> <li class="padding"> <button ng-repeat="social in sociais" ng-click="share(form, social)"class="button button-block button-{{ social }}"><i class="icon ion-social-{{ social }}"></i>{{ social | uppercase }} </button> </li> </ul> </ion-content> </ion-modal-view>';

            console.log(post);

            if (post === undefined) return false;
            var scope = $rootScope.$new(true);
            var socials = [
                'facebook',
                'instagram',
                'whatsapp',
                'twitter'
            ];
            var image = post.attributes;
            scope.sociais = socials;
            scope.share = shareSocial;
            scope.form = {
                title: image.title,
                photo: image.img._url
            };

            scope.modal = $ionicModal.fromTemplate(template, {
                scope: scope
            });
            scope.modal.show();


            function shareSocial(social, form) {
                console.log('share', social, form);
                PhotogramShare
                    .share(social, {
                        text: form.title,
                        image: form.photo,
                        link: AppConfig.app.url
                    });
            }


        }

        function filterModal(image, action) {
            image = 'data:image/jpeg;base64,' + image;

            var template =
                '<ion-modal-view class="modal-capture"><ion-header-bar class="bar-dark"><button class="button button-clear button-icon ion-ios-arrow-thin-left"ng-click="closeFilter()"></button><div class="title">{{ \'Filters\' | translate }}</div><button class="button button-icon " ng-click="submitFilter()"><i class="icon ion-ios-arrow-thin-right"></i></button></ion-header-bar><ion-content><photo-filter image="form.photo"></photo-filter></ion-content></ion-modal-view>';
            var scope = $rootScope.$new(true);
            scope.closeFilter = closeFilter;
            scope.submitFilter = submitFilter;
            scope.form = {
                photo: image
            };

            scope.modalFilter = $ionicModal.fromTemplate(template, {
                scope: scope
            });

            scope.modalFilter.show();

            function submitFilter() {
                var canvas = window.document.getElementById('image');
                var dataUrl = canvas.toDataURL();
                console.log('Submit Filter');
                action(dataUrl);
            }

            function closeFilter() {
                console.log('Close Modal Filter');
                scope.modalFilter.hide();
            }

            $rootScope.$on('filterModal:close', closeFilter);
        }


        function capture(type, options) {
            var defer = $q.defer();

            // CAMERA
            if (type === 0) {
                options.sourceType = Camera.PictureSourceType.CAMERA;
                getPicture();
            }

            // GALLERY
            if (type === 1) {
                options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                getPicture();
            }

            // Video
            if (type === 2) {
                getVideo();
            }

            console.log('capture image', options);

            function getVideo () {
                $cordovaCapture
                    .captureVideo({ limit: 1, duration: 5 })
                    .then(function  (mediaFiles) {
                        var path = mediaFiles[0].fullPath;
                        defer.resolve(path);
                    }, defer.reject);
            }

            function getPicture () {
                $cordovaCamera
                    .getPicture(options)
                    .then(defer.resolve, defer.reject);
                return defer.promise;
            }
        }
    }

    // jrCrop
    function ionCropDirective($jrCrop, $ionicActionSheet, gettextCatalog) {

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

        function ionCropLink($scope, element) {

            // Triggered on a button click, or some other target
            $scope.action = action;
            element.bind('click', getElem);
            $scope.crop = crop;
            angular.element(document.getElementById('browseBtn'))
                .on('change', fileUpload);


            function getElem() {
                document.getElementById('browseBtn')
                    .click();
            }

            function action() {

                // Show the action sheet
                $ionicActionSheet.show({
                    buttons: [{
                        text: '<i class="icon ion-camera"></i>' + gettextCatalog.getString('Photo Camera')
                    }, {
                        text: '<i class="icon ion-images"></i> ' + gettextCatalog.getString('Photo Album')
                    }],
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

            function fileUpload(e) {

                var file = e.target.files[0];
                var reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = function (event) {
                    var image = event.target.result;
                    $scope.crop(image);
                };

                // Clear input file
                angular.element(document.getElementById('browseBtn'))
                    .val('');

            }

            function crop(image) {

                console.log($scope.option);

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
    function PhotoFilterFactory($rootScope, $q, $ionicModal) {

        return {
            load: modalFilter
        };

        function modalFilter(image, done) {
            var template =
                '<ion-modal-view class="modal-capture"><ion-header-bar class="bar-dark"><button class="button button-clear button-icon ion-ios-arrow-thin-left"ng-click="closeCapture()"></button><div class="title text-left">{{ \'Filters\' | translate }}</div><button class="button button-clear button-icon ion-ios-arrow-thin-right"ng-click="submitCapture()"></button></ion-header-bar><ion-content scroll="false"><photo-filter image="form.photo"></photo-filter></ion-content></ion-modal-view>';
            var image = image.toDataURL();

            var scope = $rootScope.$new(true);
            scope.closeCapture = closeModalCapture;
            scope.submitCapture = submitCapture;
            scope.form = {
                photo: image
            };

            scope.modal = $ionicModal.fromTemplate(template, {
                scope: scope
            });

            scope.modal.show();


            function submitCapture() {
                var canvas = window.document.getElementById('image');
                var dataUrl = canvas.toDataURL();
                console.log(dataUrl);
                done(dataUrl);
                closeModalCapture();
            }

            function closeModalCapture() {
                scope.modal.hide();
            }

        }

    }

    function photoFilterDirective() {
        return {
            restrict: 'E',
            scope: {
                image: '='
            },
            transclude: true,
            template: '<div class="capture-photo"> <div caman filter="\'normal\'" class="image" ng-class="{disabled: loading}" name="image" image="image"></div>  <ion-spinner ng-show="loading"></ion-spinner></div><photo-carousel image="image" loading="loading"></photo-carousel>'
        };
    }

    function photoFilterCarouselDirective(CamanJs) {
        return {
            restrict: 'E',
            scope: {
                image: '=',
                loading: '='
            },
            template: '<div class="wide-as-needed"> <a ng-repeat="filter in filters" ng-click="applyFilter(\'image\', filter)" > <div class="image" caman ng-class="{disabled: loading}" loading="loading" filter="filter" image="image" name="image{{ $index }}"></div> <ion-spinner ng-if="loading" ></ion-spinner>  <p>{{ filter }}</p> </a> </div>',
            link: function ($scope, elem) {
                $scope.filters = CamanJs.filters;
                $scope.applyFilter = applyFilter;

                function applyFilter(elem, effect) {
                    $scope.loading = true;
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

    function camanDirective(CamanJs, $timeout) {
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

        function camanDirectiveLink($scope, elem) {
            $scope.loading = true;
            $timeout(function () {
                CamanJs
                    .effect($scope.name, $scope.filter)
                    .then(function () {
                        $scope.loading = false;
                    });
            }, 500);
        }
    }


    function CamanJs($q) {
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

        function filter(elem, effect, status) {
            var defer = $q.defer();
            var image = window.document.getElementById(elem);

            Caman(image, applyEffect);

            function applyEffect() {

                if (effect === 'normal') {
                    this.revert();
                    this.render(function () {
                        defer.resolve(effect);
                    });
                }

                if (effect in this) {
                    this[effect]();
                    if (status) resetEffect(elem);
                    this.render(function () {
                        defer.resolve(effect);
                    });
                }
            }

            return defer.promise;
        }

        function resetEffect(elem) {

            var defer = $q.defer();
            var image = window.document.getElementById(elem);
            Caman(image, resetCaman);

            function resetCaman() {
                this.revert();
                defer.resolve(true);
            }

            return defer.promise;
        }
    }
})();
