(function () {
    'use strict';

    angular
        .module('ion-photo')
        .factory('PhotoService', PhotoService);

    function PhotoService($ionicActionSheet, AppConfig, PhotogramShare, $jrCrop, $rootScope, $ionicModal,
                          $cordovaCamera, $cordovaCapture, $q, Notify) {

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
                text: '<i class="icon ion-ios-camera"></i>' + ('Camera')
            }, {
                text: '<i class="icon ion-images"></i>' + ('Gallery')
            }, {
                text: '<i class="icon ion-ios-videocam"></i>' + ('Video')
            }];
            var actionSheet = $ionicActionSheet.show({
                buttons: buttons,
                titleText: ('Share Photo'),
                cancelText: ('Cancel'),
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
                        title: ('Error'),
                        text: ('Enabled your camera')
                    });
                    buttonCancel();
                }
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
                actionSheet(resp);
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
                    cancelText: ('Cancel'),
                    chooseText: ('Save')
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

            function getVideo() {
                $cordovaCapture
                    .captureVideo({
                        limit: 1,
                        duration: 5
                    })
                    .then(function (mediaFiles) {
                        var path = mediaFiles[0].fullPath;
                        defer.resolve(path);
                    }, defer.reject);
            }

            function getPicture() {
                $cordovaCamera
                    .getPicture(options)
                    .then(defer.resolve, defer.reject);
                return defer.promise;
            }
        }
    }
})();
