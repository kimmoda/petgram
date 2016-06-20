(function () {
    'use strict';
    angular.module('starter').factory('Geolocation', GeolocationFactory);

    function GeolocationFactory($ionicPlatform, $q) {
        return {
            getCurrentPosition: getCurrentPosition
        };

        function getCurrentPosition() {
            var defer = $q.defer();

            $ionicPlatform.ready(function () {
                var options = {
                    maximumAge        : 3000,
                    timeout           : 5000,
                    enableHighAccuracy: true
                };
                navigator.geolocation.getCurrentPosition(
                    defer.resolve,
                    defer.reject,
                    options);
            });

            return defer.promise;
        }
    }

})();