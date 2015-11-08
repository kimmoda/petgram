(function (window, angular, Parse, undefined) {
    'use strict';
    angular
        .module('app.photogram')
        .factory('PhotogramSetting', PhotogramSetting)
        .factory('PhotogramShare', PhotogramShare)
        .factory('ParseImageService', ParseImageService);

    function ParseImageService($window) {

        var _all = function () {
            var query = new Parse.Query('ImageInfo');
            query.descending('createdAt');
            return query.find();
        };
        var _delete = function (_objectId) {
            var query = new Parse.Query('ImageInfo');
            return query.get(_objectId).then(function (_data) {
                return _data.destroy();
            });
        };
        var _get = function (_objectId) {
            var query = new Parse.Query('ImageInfo');
            //query.descending('gpa');
            return query.get(_objectId);
        };
        /**
         *
         * @param _params
         * @private
         */
        var _save = function (_params) {
            var ImageObject = Parse.Object.extend('Gallery');


            if (_params.photo !== '') {

                console.log('_params.photo ' + _params.photo);

                // create the parse file
                var imageFile = new Parse.File('mypic.jpg', {
                    base64: _params.photo
                });
                //       var imageFile = new Parse.File('mypic.jpg', _params.photo);


                // save the parse file
                return imageFile.save().then(function () {

                    _params.photo = null;

                    // create object to hold caption and file reference
                    var imageObject = new ImageObject();

                    // set object properties
                    imageObject.set('title', _params.title);
                    imageObject.set('img', imageFile);
                    imageObject.set('user', Parse.User.current());
                    imageObject.set('thumbBase64', _params.thumbBase64);
                    imageObject.set('location', new Parse.GeoPoint(_params.coords.latitude, _params.coords.longitude));

                    // save object to parse backend
                    return imageObject.save();


                }, function (error) {
                    console.log('Error');
                    console.log(error);
                });

            } else {
                // create object to hold caption and file reference
                var imageObject = new ImageObject();

                // set object properties
                imageObject.set('caption', _params.caption);

                // save object to parse backend
                return imageObject.save();

            }
        }

        function imageSettings() {
            var savedData = $window.localStorage.getItem('application.image.props') || null;
            return (savedData !== null ? JSON.parse(savedData) : {
                quality: 50,
                dimensions: 250,
                saveToAlbum: false
            });
        }

        function saveImageSettings(_settings) {
            $window.localStorage.setItem('application.image.props', JSON.stringify(_settings));
        }

        return {
            all: _all,
            save: _save,
            get: _get,
            delete: _delete,
            imageSettings: imageSettings,
            saveImageSettings: saveImageSettings
        }
    }


    function PhotogramShare(AppConfig, gettextCatalog, $ionicActionSheet, Notify, $cordovaSocialSharing) {

        var message = {
            title: gettextCatalog.getString('Join me from ') + AppConfig.app.name + '!',
            subject: gettextCatalog.getString("I'm at ") + AppConfig.app.name + '!. ' + gettextCatalog.getString(
                'Install the application and follow me!') + ' ' + AppConfig.app.url,
            image: AppConfig.app.image,
            link: AppConfig.app.url
        };


        function success() {
            Notify.alert({
                title: gettextCatalog.getString('Thanks'),
                text: gettextCatalog.getString('Thank you for sharing!!')
            });
        }

        function error(err) {
            console.error(err);
        }

        function share(social) {
            switch (social) {
                case 'facebook':
                    $cordovaSocialSharing
                        .shareViaFacebook(message.text, message.image, message.link)
                        .then(success, error);
                    break;

                case 'twitter':
                    $cordovaSocialSharing
                        .shareViaTwitter(message.text, message.image, message.link)
                        .then(success, error);
                    break;

                case 'whatsapp':
                    $cordovaSocialSharing
                        .shareViaWhatsApp(message.text, message.image, message.link)
                        .then(success, error);
                    break;

                case 'email':
                    $cordovaSocialSharing
                        .shareViaEmail(message.title, message.subject)
                        .then(success, error);
                    break;
            }
        }

        function open() {
            var modal = $ionicActionSheet
                .show({
                    buttons: [{
                        text: '<i class="icon ion-social-facebook"></i>' + gettextCatalog.getString('Facebook')
                    }, {
                        text: '<i class="icon ion-social-twitter"></i>' + gettextCatalog.getString('Twitter')
                    }, {
                        text: '<i class="icon ion-social-whatsapp"></i>' + gettextCatalog.getString('Whatsapp')
                    }, {
                        text: '<i class="icon ion-email"></i>' + gettextCatalog.getString('Email')
                    }],
                    titleText: gettextCatalog.getString('Share'),
                    cancelText: gettextCatalog.getString('Cancel'),
                    cancel: function () {
                        return false;
                    },
                    buttonClicked: function (index) {
                        console.log(index);
                        switch (index) {
                            case 0:
                                share('facebook');
                                break;
                            case 1:
                                share('twitter');
                                break;
                            case 2:
                                share('whatsapp');
                                break;
                            case 3:
                                share('email');
                                break;
                        }
                        modal();
                        //share(index);
                    }
                });

        }

        return {
            share: share,
            open: open
        };
    }


    function PhotogramSetting($window, $q) {

        return {
            init: init,
            get: get
        };

        function init() {
            var defer = $q.defer();
            var data = [];

            new Parse
                .Query('GallerySetting')
                .find()
                .then(function(resp) {
                    angular.forEach(resp, function (item) {
                        var obj = {
                            key: item.attributes.key,
                            value: item.attributes.value
                        }
                        console.log(obj);
                        delete $window.localStorage[obj.key];
                        $window.localStorage[obj.key] = obj.value;
                        data.push(obj);

                    });
                    defer.resolve(data);
                }, error);

            return defer.promise;

        }

        function error(err) {
            alert(err);
        }

        function get(key) {
            return $window.localStorage[key];
        }

    }

})(window, window.angular, window.Parse);
