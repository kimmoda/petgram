(function (window, angular,Parse, undefined) {
    'use strict';
    angular
        .module('app.photogram')
        .factory('PhotogramSetting', PhotogramSettingFactory);

    function PhotogramSettingFactory ($window, $q) {

        return {
            init: init,
            get: get
        };

        function init () {
            var defer = $q.defer();
            var data = [];

            new Parse
                .Query ('GallerySetting')
                .find()
                .then(function (resp) {
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

        function error (err) {
            alert (err);
        }

        function get (key) {
            return $window.localStorage[key];
        }

    }


}) (window, window.angular, window.Parse);