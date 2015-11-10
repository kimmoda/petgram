(function (window, angular, ionic, document, undefined) {
    'use strict';
    angular
        .module('ion-crop', [
            'ionic',
            'gettext'
        ])
        .factory('fileReader', fileReader)
        .factory('$jrCrop', $jrCrop)
        .directive('ionCrop', ionCrop);

    function ionCrop ($jrCrop, $ionicActionSheet, gettextCatalog) {

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

                var file = e.target.files[0];
                var reader = new FileReader ();
                reader.readAsDataURL(file);

                reader.onload = function (event) {
                    var image = event.target.result;
                    $scope.crop(image);
                };

                // Clear input file
                angular.element(document.getElementById('browseBtn')).val('');

            }

            function crop (image) {

                $jrCrop
                    .crop({
                        url: image,
                        width: $scope.option ? $scope.option.width : 500,
                        height: $scope.option ? $scope.option.height : 500,
                        cancelText: gettextCatalog.getString('Cancel'),
                        chooseText: gettextCatalog.getString('Save')
                    })
                    .then(function (canvas) {
                        var image = canvas.toDataURL();
                        $scope.ngModel = image;
                    });

            }


        }
    }


    function $jrCrop ($ionicModal, $rootScope, $q) {

        var template = '<div class="jr-crop modal">' +
            '<div class="jr-crop-center-container">' +
            '<div class="jr-crop-img" ng-style="{width: width + \'px\', height: height + \'px\'}"></div>' +
            '</div>' +
            '<div class="jr-crop-center-container">' +
            '<div class="jr-crop-select" style="overflow: hidden" ng-style="{width: width + \'px\', height: height + \'px\'}"></div>' +
            '</div>' +
            '<div class="bar bar-top">' +
            '<div class="title">{{ "Crop Photo" | translate}}</div>' +
            '</div>' +

            '<div class="bar bar-footer jr-crop-footer">' +
            '<button class="button button-icon ion-ios-close-empty" ng-click="cancel()">Cancel</button>' +
            '<button class="button button-icon ion-ios-checkmark-empty" ng-click="crop()">Apply</button>' +
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

            initialize: initialize,

            /**
             * Init the image in a center position
             */
            initImage: initImage,

            cancel: cancel,

            /**
             * This is where the magic happens
             */
            bindHandlers: bindHandlers,

            setImageTransform: setImageTransform,

            /**
             * Calculate the new image from the values calculated by
             * user input. Return a canvas-object with the image on it.
             *
             * Note: It doesn't actually downsize the image, it only returns
             * a cropped version. Since there's inconsistenties in image-quality
             * when downsizing it's up to the developer to implement this. Preferably
             * on the server.
             */
            crop: crop,

            /**
             * Load the image and return the element.
             * Return Promise that will fail when unable to load image.
             */
            loadImage: loadImage
        });

        var options = {
            width: 0,
            height: 0,
            aspectRatio: 0
        };

        return {
            options: options,
            crop: cropper,
            initOptions: initOptions
        };


        function initialize (options) {
            var self = this;

            self.options = options;
            self.promise = $q.defer();
            self.loadImage()
                .then(function (elem) {
                    self.imgWidth = elem.naturalWidth;
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
            self.options.crop = this.crop.bind(this);
            self.options.cancelText = self.options.cancelText;
            self.options.chooseText = self.options.chooseText;
        }

        function initImage () {
            var self = this;

            if (self.options.height < self.imgHeight || self.options.width < self.imgWidth) {
                var imgAspectRatio = self.imgWidth / self.imgHeight;
                var selectAspectRatio = self.options.width / self.options.height;

                if (selectAspectRatio > imgAspectRatio) {
                    self.scale = self.last_scale = self.options.width / self.imgWidth;
                } else {
                    self.scale = self.last_scale = self.options.height / self.imgHeight;
                }
            }

            var centerX = (self.imgWidth - self.options.width) / 2;
            var centerY = (self.imgHeight - self.options.height) / 2;

            self.posX = self.last_posX = -centerX;
            self.posY = self.last_posY = -centerY;

            self.setImageTransform();
        }

        function cancel () {
            var self = this;

            self.options.modal.remove()
                .then(function () {
                    self.promise.reject('canceled');
                });
        }

        function bindHandlers () {
            var self = this,

                min_pos_x = 0,
                min_pos_y = 0,
                max_pos_x = 0,
                max_pos_y = 0,
                transforming_correctX = 0,
                transforming_correctY = 0,

                scaleMax = 1,
                scaleMin,
                image_ratio = self.imgWidth / self.imgHeight,
                cropper_ratio = self.options.width / self.options.height;

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
                var currWidth = self.scale * self.imgWidth;
                var currHeight = self.scale * self.imgHeight;

                // Images are scaled from the center
                min_pos_x = (currWidth - self.imgWidth) / 2;
                min_pos_y = (currHeight - self.imgHeight) / 2;
                max_pos_x = -(currWidth - min_pos_x - self.options.width);
                max_pos_y = -(currHeight - min_pos_y - self.options.height);
            }

            // Based on: http://stackoverflow.com/questions/18011099/pinch-to-zoom-using-hammer-js
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

            }, self.options.modal.el);
        }

        function setImageTransform () {
            var self = this;

            var transform =
                'translate3d(' + self.posX + 'px,' + self.posY + 'px, 0) ' +
                'scale3d(' + self.scale + ',' + self.scale + ', 1)';

            self.imgSelect.style[ionic.CSS.TRANSFORM] = transform;
            self.imgFull.style[ionic.CSS.TRANSFORM] = transform;
        }

        function crop () {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');

            // Canvas size is original proportions but scaled down.
            canvas.width = this.options.width / this.scale;
            canvas.height = this.options.height / this.scale;

            // The full proportions
            var currWidth = this.imgWidth * this.scale;
            var currHeight = this.imgHeight * this.scale;

            // Because the top/left position doesn't take the scale of the image in
            // we need to correct this value.
            var correctX = (currWidth - this.imgWidth) / 2;
            var correctY = (currHeight - this.imgHeight) / 2;

            var sourceX = (this.posX - correctX) / this.scale;
            var sourceY = (this.posY - correctY) / this.scale;

            context.drawImage(this.imgFull, sourceX, sourceY);


            //------ reduced draw ---
            var canvas2 = document.createElement("canvas");
            canvas2.width = this.options.width;
            canvas2.height = this.options.height;
            var ctx2 = canvas2.getContext("2d");
            ctx2.drawImage(canvas, 0, 0, this.options.width, this.options.height);

            // -- back from reduced draw ---
            context.drawImage(canvas2, 0, 0, canvas.width, canvas.height);


            this.options.modal.remove();
            this.promise.resolve(canvas2);
        }

        function loadImage () {
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

        function cropper (options) {
            this.initOptions(options);

            var scope = $rootScope.$new(true);

            ionic.Utils.extend(scope, this.options);

            scope.modal = $ionicModal.fromTemplate(template, {
                scope: scope
            });

            // Show modal and initialize cropper.
            return scope.modal.show()
                        .then(function () {
                            return (new jrCropController (scope)).promise.promise;
                        });
        }

        function initOptions (options) {
            ionic.Utils.extend(this.options, options);

            // if (this.options.aspectRatio) {

            //     if (!this.options.width && this.options.height) {
            //         this.options.width = 200;
            //     }

            //     if (this.options.width) {
            //         this.options.height = this.options.width / this.options.aspectRatio;
            //     } else if (this.options.height) {
            //         this.options.width = this.options.height * this.options.aspectRatio;
            //     }
            // }
        }
    }


    function fileReader ($q) {

        return {
            readAsDataUrl: readAsDataUrl
        }

        function readAsDataUrl (filePath) {

            var deferred = $q.defer();

            function gotFileEntry (fileEntry) {
                fileEntry.file(gotFile, fail);
            }

            function gotFile (file) {
                readDataUrl (file);
            }

            function readDataUrl (file) {
                var reader = new FileReader ();
                reader.onloadend = function (evt) {
                    console.log("Read as data URL");
                    var fileContent = evt.target.result;
                    deferred.resolve(fileContent);

                };
                reader.readAsArrayBuffer(file);
            }

            function fail (evt) {
                console.log(evt.target.error.code);
            }

            window.resolveLocalFileSystemURI(filePath, gotFileEntry, fail);

            return deferred.promise;
        }
    }

    function base64ToBlob (base64Data, contentType) {
        contentType = contentType || '';
        var sliceSize = 1024;
        var byteCharacters = atob (base64Data);
        var bytesLength = byteCharacters.length;
        var slicesCount = Math.ceil(bytesLength / sliceSize);
        var byteArrays = new Array (slicesCount);

        for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            var begin = sliceIndex * sliceSize;
            var end = Math.min(begin + sliceSize, bytesLength);

            var bytes = new Array (end - begin);
            for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array (bytes);
        }
        return new Blob (byteArrays, {
            type: contentType
        });
    }


}) (window, window.angular, window.ionic, window.document);
