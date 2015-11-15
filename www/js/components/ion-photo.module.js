(function (window, angular, undefined) {
    'use strict';
    angular
        .module('ion-photo', [
            'ionic',
            'ngCordova',
            'gettext'
        ])
        .factory('PhotoService', PhotoService)
        // Photo Crop
        .directive('ionCrop', ionCropDirective)
        .factory('$jrCrop', jrCropFactory)

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
            var template = '<ion-modal-view class="modal-capture"><ion-header-bar class="bar-dark"><button class="button button-clear button-icon ion-ios-arrow-thin-left"ng-click="closeCapture()"></button><div class="title">{{ \'Filters\' | translate }}</div><button class="button button-positive"ng-click="submitCapture()"><i class="icon ion-arrow-right-b"></i></button></ion-header-bar><ion-content><photo-filter image="form.photo"></photo-filter></ion-content></ion-modal-view>';
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
    function jrCropFactory ($ionicModal, $rootScope, $q) {

        var template = '<div class="jr-crop modal">' +
            '<div class="jr-crop-center-container">' +
            '<div class="jr-crop-img" ng-style="{width: width + \'px\', height: height + \'px\'}"></div>' +
            '</div>' +
            '<div class="jr-crop-center-container">' +
            '<div class="jr-crop-select" style="overflow: hidden" ng-style="{width: width + \'px\', height: height + \'px\'}"></div>' +
            '</div>' +
            '<div class="bar bar-footer bar-dark jr-crop-footer">' +
            '<button class="button button-clear" ng-click="cancel()">{{cancelText}}</button>' +
            '<div class="title">{{title}}</div>' +
            '<button class="button button-clear" ng-click="crop()">{{chooseText}}</button>' +
            '</div>' +
            '</div>';

        var jrCropController = ionic.views.View.inherit({

            promise: null,
            imgWidth: null,
            imgHeight: null,

            // Elements that hold the cropped version and the full
            // overlaying image.
            imgSelect: null,
            imgFull: null,

            // Values exposed by scaling and moving. Needed
            // to calculate the result of cropped image
            posX: 0,
            posY: 0,
            scale: 1,

            last_scale: 1,
            last_posX: 0,
            last_posY: 0,

            initialize: function (options) {
                var self = this;

                self.options = options;
                self.promise = $q.defer();
                self.loadImage()
                    .then(function (elem) {
                        self.imgWidth  = elem.naturalWidth;
                        self.imgHeight = elem.naturalHeight;

                        self.options.modal.el.querySelector('.jr-crop-img')
                            .appendChild(self.imgSelect = elem.cloneNode());
                        self.options.modal.el.querySelector('.jr-crop-select')
                            .appendChild(self.imgFull = elem.cloneNode());

                        self.bindHandlers();
                        self.initImage();
                    });

                // options === scope. Expose actions for modal.
                self.options.cancel = this.cancel.bind(this);
                self.options.crop   = this.crop.bind(this);
            },

            /**
             * Init the image in a center position
             */
            initImage: function () {
                if (this.options.height < this.imgHeight || this.options.width < this.imgWidth) {
                    var imgAspectRatio    = this.imgWidth / this.imgHeight;
                    var selectAspectRatio = this.options.width / this.options.height;

                    if (selectAspectRatio > imgAspectRatio) {
                        this.scale = this.last_scale = this.options.width / this.imgWidth;
                    } else {
                        this.scale = this.last_scale = this.options.height / this.imgHeight;
                    }
                }

                var centerX = (this.imgWidth - this.options.width) / 2;
                var centerY = (this.imgHeight - this.options.height) / 2;

                this.posX = this.last_posX = -centerX;
                this.posY = this.last_posY = -centerY;

                this.setImageTransform();
            },

            cancel: function () {
                var self = this;

                self.options.modal.remove()
                    .then(function () {
                        self.promise.reject('canceled');
                    });
            },

            /**
             * This is where the magic happens
             */
            bindHandlers: function () {
                var self                  = this,

                    min_pos_x             = 0, min_pos_y = 0,
                    max_pos_x             = 0, max_pos_y = 0,
                    transforming_correctX = 0, transforming_correctY = 0,

                    scaleMax              = 1, scaleMin,
                    image_ratio           = self.imgWidth / self.imgHeight,
                    cropper_ratio         = self.options.width / self.options.height;

                if (cropper_ratio < image_ratio) {
                    scaleMin = self.options.height / self.imgHeight;
                } else {
                    scaleMin = self.options.width / self.imgWidth;
                }

                function setPosWithinBoundaries () {
                    calcMaxPos ();
                    if (self.posX > min_pos_x) {
                        self.posX = min_pos_x;
                    }
                    if (self.posX < max_pos_x) {
                        self.posX = max_pos_x;
                    }
                    if (self.posY > min_pos_y) {
                        self.posY = min_pos_y;
                    }
                    if (self.posY < max_pos_y) {
                        self.posY = max_pos_y;
                    }
                }

                /**
                 * Calculate the minimum and maximum positions.
                 * This took some headaches to write, good luck
                 * figuring this out.
                 */
                function calcMaxPos () {
                    // Calculate current proportions of the image.
                    var currWidth  = self.scale * self.imgWidth;
                    var currHeight = self.scale * self.imgHeight;

                    // Images are scaled from the center
                    min_pos_x = (currWidth - self.imgWidth) / 2;
                    min_pos_y = (currHeight - self.imgHeight) / 2;
                    max_pos_x = -(currWidth - min_pos_x - self.options.width);
                    max_pos_y = -(currHeight - min_pos_y - self.options.height);
                }

                // Based on: http://stackoverflow.com/questions/18011099/pinch-to-zoom-using-hammer-js
                var options = {
                    prevent_default_directions: [
                        'left',
                        'right',
                        'up',
                        'down'
                    ]
                };
                ionic.onGesture('touch transform drag dragstart dragend', function (e) {
                    switch (e.type) {
                        case 'touch':
                            self.last_scale = self.scale;
                            break;
                        case 'drag':
                            self.posX = self.last_posX + e.gesture.deltaX - transforming_correctX;
                            self.posY = self.last_posY + e.gesture.deltaY - transforming_correctY;
                            setPosWithinBoundaries ();
                            break;
                        case 'transform':
                            self.scale = Math.max(scaleMin, Math.min(self.last_scale * e.gesture.scale, scaleMax));
                            setPosWithinBoundaries ();
                            break;
                        case 'dragend':
                            self.last_posX = self.posX;
                            self.last_posY = self.posY;
                            break;
                        case 'dragstart':
                            self.last_scale = self.scale;

                            // After scaling, hammerjs needs time to reset the deltaX and deltaY values,
                            // when the user drags the image before this is done the image will jump.
                            // This is an attempt to fix that.
                            if (e.gesture.deltaX > 1 || e.gesture.deltaX < -1) {
                                transforming_correctX = e.gesture.deltaX;
                                transforming_correctY = e.gesture.deltaY;
                            } else {
                                transforming_correctX = 0;
                                transforming_correctY = 0;
                            }
                            break;
                    }

                    self.setImageTransform();

                }, self.options.modal.el, options);
            },

            setImageTransform: function () {
                var self = this;

                var transform =
                        'translate3d(' + self.posX + 'px,' + self.posY + 'px, 0) ' +
                        'scale3d(' + self.scale + ',' + self.scale + ', 1)';

                self.imgSelect.style[ionic.CSS.TRANSFORM] = transform;
                self.imgFull.style[ionic.CSS.TRANSFORM]   = transform;
            },

            /**
             * Calculate the new image from the values calculated by
             * user input. Return a canvas-object with the image on it.
             *
             * Note: It doesn't actually downsize the image, it only returns
             * a cropped version. Since there's inconsistenties in image-quality
             * when downsizing it's up to the developer to implement this. Preferably
             * on the server.
             */
            crop: function () {
                var canvas  = document.createElement('canvas');
                var context = canvas.getContext('2d');

                // Canvas size is original proportions but scaled down.
                canvas.width  = this.options.width / this.scale;
                canvas.height = this.options.height / this.scale;

                // The full proportions
                var currWidth  = this.imgWidth * this.scale;
                var currHeight = this.imgHeight * this.scale;

                // Because the top/left position doesn't take the scale of the image in
                // we need to correct this value.
                var correctX = (currWidth - this.imgWidth) / 2;
                var correctY = (currHeight - this.imgHeight) / 2;

                var sourceX = (this.posX - correctX) / this.scale;
                var sourceY = (this.posY - correctY) / this.scale;

                context.drawImage(this.imgFull, sourceX, sourceY);


                //------ reduced draw ---
                var canvas2    = document.createElement("canvas");
                canvas2.width  = this.options.width;
                canvas2.height = this.options.height;
                var ctx2       = canvas2.getContext("2d");
                ctx2.drawImage(canvas, 0, 0, this.options.width, this.options.height);

                // -- back from reduced draw ---
                context.drawImage(canvas2, 0, 0, canvas.width, canvas.height);


                this.options.modal.remove();
                this.promise.resolve(canvas2);
            },

            /**
             * Load the image and return the element.
             * Return Promise that will fail when unable to load image.
             */
            loadImage: function () {
                var promise = $q.defer();

                // Load the image and resolve with the DOM node when done.
                angular.element('<img />')
                       .bind('load', function (e) {
                           promise.resolve(this);
                       })
                       .bind('error', promise.reject)
                       .prop('src', this.options.url);

                // Return the promise
                return promise.promise;
            }
        });

        return {
            defaultOptions: {
                width: 0,
                height: 0,
                aspectRatio: 0,
                cancelText: 'Cancel',
                chooseText: 'Choose'
            },

            crop: function (options) {
                options = this.initOptions(options);

                var scope = $rootScope.$new(true);

                ionic.extend(scope, options);

                scope.modal = $ionicModal.fromTemplate(template, {
                    scope: scope
                });

                // Show modal and initialize cropper.
                return scope.modal.show()
                            .then(function () {
                                return (new jrCropController (scope)).promise.promise;
                            });
            },

            initOptions: function (_options) {
                var options;

                // Apply default values to options.
                options = ionic.extend({}, this.defaultOptions);
                options = ionic.extend(options, _options);

                if (options.aspectRatio) {

                    if (!options.width && options.height) {
                        options.width = 200;
                    }

                    if (options.width) {
                        options.height = options.width / options.aspectRatio;
                    } else if (options.height) {
                        options.width = options.height * options.aspectRatio;
                    }
                }

                return options;
            }
        };
    }

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
            var template = '<ion-modal-view class="modal-capture"><ion-header-bar class="bar-dark"><button class="button button-clear button-icon ion-ios-arrow-thin-left"ng-click="closeCapture()"></button><div class="title">{{ \'Filters\' | translate }}</div><button class="button button-positive"ng-click="submitCapture()"><i class="icon ion-arrow-right-b"></i></button></ion-header-bar><ion-content><photo-filter image="form.photo"></photo-filter></ion-content></ion-modal-view>';
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
            template: '<div class="list"> <div class="item no-padding capture-photo" caman filter="\'normal\'" name="image" image="image"> </div> </div> <photo-carousel image="image"></photo-carousel>',
            link: function (scope, elem) {

            }
        };
    }

    function photoFilterCarouselDirective () {
        return {
            restrict: 'E',
            scope: {
                image: '='
            },
            transclude: true,
            template: '<div class="wide-as-needed"> <a ng-repeat="filter in filters" ng-click="applyFilter(\'image\', filter)"> <div caman filter="filter" image="image" name="image{{ $index }}"> </div> <p>{{ filter }}</p> </a> </div>',
            controller: function ($scope, CamanJs) {
                $scope.filters     = CamanJs.filters;
                $scope.applyFilter = applyFilter;
                function applyFilter (elem, effect) {
                    CamanJs
                        .effect(elem, effect, true)
                        .then(function (resp) {
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
            template: '<img ng-src="{{ image }}" id="{{ name }}" ng-class="{\'loading\':loading}">',
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
            }, 1);
        }
    }


    function CamanJs ($q, $ionicLoading) {
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
}) (window, window.angular);
