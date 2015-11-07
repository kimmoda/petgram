(function (window, angular, undefined) {
  'use strict';
  angular
    .module('ion-crop', ['ionic'])
    .factory('fileReader', fileReader)
    .factory('$jrCrop', $jrCrop)
    .directive('ionCrop', ionCrop);

  function $jrCrop($ionicModal, $rootScope, $q) {

    var template = '<div class="jr-crop modal">' +
      '<div class="jr-crop-center-container">' +
      '<div class="jr-crop-img" ng-style="{width: width + \'px\', height: height + \'px\'}"></div>' +
      '</div>' +
      '<div class="jr-crop-center-container">' +
      '<div class="jr-crop-select" style="overflow: hidden" ng-style="{width: width + \'px\', height: height + \'px\'}"></div>' +
      '</div>' +
      '<div class="bar bar-top jr-crop-footer">' +
      '<button class="button button-icon ion-ios7-close-empty" ng-click="cancel()"></button>' +
      '<div class="title">{{title | translate}}</div>' +
      '<button class="button button-icon ion-ios-checkmark-empty" ng-click="crop()"></button>' +
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
        self.loadImage().then(function (elem) {
          self.imgWidth = elem.naturalWidth;
          self.imgHeight = elem.naturalHeight;

          self.options.modal.el.querySelector('.jr-crop-img').appendChild(self.imgSelect = elem.cloneNode());
          self.options.modal.el.querySelector('.jr-crop-select').appendChild(self.imgFull = elem.cloneNode());

          self.bindHandlers();
          self.initImage();
        });

        // options === scope. Expose actions for modal.
        self.options.cancel = this.cancel.bind(this);
        self.options.crop = this.crop.bind(this);
        self.options.cancelText = self.options.cancelText;
        self.options.chooseText = self.options.chooseText;
      },

      /**
       * Init the image in a center position
       */
      initImage: function () {
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
      },

      cancel: function () {
        var self = this;

        self.options.modal.remove().then(function () {
          self.promise.reject('canceled');
        });
      },

      /**
       * This is where the magic happens
       */
      bindHandlers: function () {
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

        function setPosWithinBoundaries() {
          calcMaxPos();
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
        function calcMaxPos() {
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
            setPosWithinBoundaries();
            break;
          case 'transform':
            self.scale = Math.max(scaleMin, Math.min(self.last_scale * e.gesture.scale, scaleMax));
            setPosWithinBoundaries();
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
      },

      setImageTransform: function () {
        var self = this;

        var transform =
          'translate3d(' + self.posX + 'px,' + self.posY + 'px, 0) ' +
          'scale3d(' + self.scale + ',' + self.scale + ', 1)';

        self.imgSelect.style[ionic.CSS.TRANSFORM] = transform;
        self.imgFull.style[ionic.CSS.TRANSFORM] = transform;
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
      options: {
        width: 0,
        height: 0,
        aspectRatio: 0
      },

      crop: function (options) {
        this.initOptions(options);

        var scope = $rootScope.$new(true);

        ionic.Utils.extend(scope, this.options);

        scope.modal = $ionicModal.fromTemplate(template, {
          scope: scope
        });

        // Show modal and initialize cropper.
        return scope.modal.show()
          .then(function () {
            return (new jrCropController(scope)).promise.promise;
          });
      },

      initOptions: function (options) {
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
    };
  }

  function ionCrop($jrCrop, $rootScope, $q, $timeout, $http, $ionicActionSheet, ENV, FileUploader, gettextCatalog) {

    function base64ToBlob(base64Data, contentType) {
      contentType = contentType || '';
      var sliceSize = 1024;
      var byteCharacters = atob(base64Data);
      var bytesLength = byteCharacters.length;
      var slicesCount = Math.ceil(bytesLength / sliceSize);
      var byteArrays = new Array(slicesCount);

      for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
          bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
      }
      return new Blob(byteArrays, {
        type: contentType
      });
    }

    return {
      restrict: 'A',
      scope: {
        cropImage: '=',
        cropOptions: '=',
        cropSave: '&'
      },
      template: '<div><input type="file" id="browseBtn" image="image" accept="image/*" style="display: none"/></div>',
      link: function ($scope, element) {
        /*
         * 1) Action Sheet (Tirar foto, Galeria)
         * 2) Galeria
         * 3) Cortar Imagem : Crop
         * 4) Fazer Upload
         * 5) Retornar endereço do arquivo
         * 6) Atualizar Model
         * */

        // Triggered on a button click, or some other target
        $scope.action = action;
        element.bind('click', getElem);
        // 3) Cortar Imagem
        $scope.crop = crop;
        // 2) File Input
        angular
          .element(document.getElementById('browseBtn'))
          .on('change', fileUpload);


        function getElem() {
          document.getElementById('browseBtn').click();
        }

        function action() {

          // Show the action sheet
          var hideSheet = $ionicActionSheet.show({
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
                document.getElementById('browseBtn').click();
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
          angular.element(document.getElementById('browseBtn')).val('');

        }

        function crop(image) {

          $jrCrop
            .crop({
              url: image,
              width: $scope.cropOptions.width || 200,
              height: $scope.cropOptions.height || 200,
              cancelText: gettextCatalog.getString('Cancel'),
              chooseText: gettextCatalog.getString('Save')
            })
            .then(function (canvas) {
              var image = canvas.toDataURL();
              var name = $scope.cropOptions.name || 'thumb';
              var filename = User.id + '_' + name + Number(new Date()) + '.jpg';

              var file = base64ToBlob(image.replace('data:image/png;base64,', ''), 'image/jpeg');
              file.name = filename;

              upload(file);


            });

        }


        /////////////
        function upload(filer) {

          var uploader = new FileUploader({
            // scope: $scope, // to automatically update the html. Default: $rootScope
            url: ENV.apiUrl + '/containers/files/upload',
            autoUpload: true
          });

          uploader.addToQueue(filer);

          uploader.onProgressItem = function () {
            $rootScope.$broadcast('loading:show');
          };

          uploader.onCompleteItem = function (fileItem, response, status, headers) {

            $rootScope.$broadcast('loading:hide');

            console.info('onCompleteItem', fileItem, response, status, headers);
            //  Delete File
            $http.delete($scope.cropImage.replace('download', 'files'))
              .success(function (data, status, headers) {
                //

              });
            //  Retorno o novo valor
            $scope.cropImage = ENV.apiUrl + '/containers/files/download/' + response.result.files.file[0].name;
            //  Executo o callback
            $timeout(function () {
              $scope.cropSave();
            }, 100);
          };


        }

      }
    };
  }


  function fileReader($q) {

    function readAsDataUrl(filePath) {

      var deferred = $q.defer();

      function gotFileEntry(fileEntry) {
        fileEntry.file(gotFile, fail);
      }

      function gotFile(file) {
        readDataUrl(file);
      }

      function readDataUrl(file) {
        var reader = new FileReader();
        reader.onloadend = function (evt) {
          console.log("Read as data URL");
          var fileContent = evt.target.result;
          deferred.resolve(fileContent);

        };
        reader.readAsArrayBuffer(file);
      }

      function fail(evt) {
        console.log(evt.target.error.code);
      }

      window.resolveLocalFileSystemURI(filePath, gotFileEntry, fail);

      return deferred.promise;
    }


    return {
      readAsDataUrl: readAsDataUrl
    }
  }


})(window, window.angular);
