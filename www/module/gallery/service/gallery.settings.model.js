(function(){
    'use strict';
    angular
        .module('module.gallery')
        .factory('GallerySetting', function (Parse, Loading, $window, $http, $q) {

            var data = [];

            function init() {
                Loading.start();
                var defer = $q.defer();

                new Parse
                    .Query('GallerySetting')
                    .find()
                    .then(function (resp) {
                        angular.forEach(resp, function (item) {
                            var obj                       = {
                                key  : item.attributes.key,
                                value: item.attributes.value
                            }
                            $window.localStorage[obj.key] = obj.value;
                            data.push(obj);

                        });
                        defer.resolve(data);
                        Loading.end();
                    }, function (err) {
                        alert(err);
                    });

                return defer.promise;

            }

            function get(key) {
                return $window.localStorage[key];
            }

            return {
                init: init,
                get : get
            };

        });
})();