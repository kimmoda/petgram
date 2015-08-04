'use strict';
angular
    .module ('module.gallery')
    .factory ('ImageService', function ($window, $q, $timeout) {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var date             = new Date ();
        var imageServiceData = [
            {
                id       : 0,
                name     : 'Scruff McGruff',
                timestamp: date
            },
            {
                id       : 1,
                name     : 'G.I. Joe',
                timestamp: date
            }
        ];

        /**
         *  This is a helper model that is created to allow the application UI to work with the
         *  local datastore and the parse datastore without modifications
         *
         * @param _params
         * @returns {{id: *, createdAt: *, get: get, set: set}}
         * @constructor
         */
        var ImageModel = function (_params) {
            var _data = {};

            /**
             *
             * @param _params
             * @private
             */
            this.set = function (_params) {

                if (!_params) {
                    return;
                }


                console.log (_params.timestamp);

                this.id        = _params.id;
                this.createdAt = _params.timestamp;


                _data['createdAt'] = _params.timestamp;
                _data.caption      = _params.name;
                _data.id           = _params.id;
                _data.picture      = {_url: _params.data};
                _data.location     = _params.location

            };
            /**
             *
             * @param _key
             * @returns {*}
             * @private
             */
            this.get = function (_key) {
                return _data[_key]
            };

            this.set (_params);

            /*
             return {
             'id': _data.id,
             'createdAt': _data.name,
             get: this._get,
             set: this._set
             };
             */
        };

        return {
            /**
             * get settings from local storage
             * @returns {*}
             */
            imageSettings    : function () {
                var savedData = $window.localStorage.getItem ("application.image.props") || null;
                return (savedData !== null ? JSON.parse (savedData) :
                {
                    quality    : 85,
                    dimensions : 350,
                    saveToAlbum: false
                });
            },
            /**
             * save settings to local storage
             * @param _settings
             */
            saveImageSettings: function (_settings) {
                $window.localStorage.setItem ("application.image.props", JSON.stringify (_settings));
            },
            /**
             *
             * @returns {Array}
             */
            all              : function () {

                var deferred = $q.defer ();

                var returnArray = [];
                angular.forEach (imageServiceData, function (_value, _key) {
                    _value.data && console.log ("length " + _value.data.length);
                    this.push (new ImageModel (_value));
                }, returnArray);

                $timeout (function () {
                    deferred.resolve (returnArray);
                }, 1);

                return deferred.promise;
            },
            /**
             *
             * @param friendId
             * @returns {*|{id: number, name: string}}
             */
            get              : function (imageId) {
                // Simple index lookup
                var deferred = $q.defer ();
                $timeout (function () {
                    deferred.resolve (new ImageModel (imageServiceData[imageId]));
                }, 1);
                return deferred.promise;
            },
            /**
             *
             * @param _params.caption
             * @param _params.photo
             */
            save             : function (_params) {
                var deferred = $q.defer ();

                var id = imageServiceData.length;

                $timeout (function () {
                    deferred.resolve (imageServiceData.push ({
                        id       : id,
                        name     : _params.caption,
                        data     : 'data:image/png;base64,' + _params.photo,
                        timestamp: new Date ()
                    }));
                }, 1);

                return deferred.promise;
            },
            delete           : function (_params) {
                var deferred = $q.defer ();

                $timeout (function () {
                    imageServiceData.splice (_params.index, 1)

                    deferred.resolve ();
                }, 1);

                return deferred.promise;
            }
        }
    }
)