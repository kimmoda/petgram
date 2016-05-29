(function () {
    'use strict';
    /**
     * @ngdoc controller
     * @name SearchMapCtrl
     *
     * @description
     * _Please update the description and dependencies._
     *
     * @requires $scope
     * */
    angular
        .module('app.search')
        .controller('SearchMapCtrl', SearchMapController);

    function SearchMapController(Photogram, $scope, $timeout, GeoService) {
        var vm   = this;
        var time = 0;
        vm.findMe = findMe;

        // Map

        $scope.map = {
            center: {
                latitude: 45,
                longitude: -73
            },
            zoom: 13
        };

        $scope.$watch('map.center.latitude', watchMap);

        function watchMap(newValue, oldValue) {
            console.log(newValue);
            if (newValue) {
                console.log(newValue);
                time += 2000;
                console.log(time);


                var timer = $timeout(function () {
                    console.log(timer);

                    Photogram
                        .nearby($scope.map.center)
                        .then(function (resp) {
                            console.log(resp);
                            time    = 0;
                            vm.data = resp;

                            $timeout.cancel(timer);
                        });
                }, time);

            }
        }


        function location() {
            init();
        }

        function findMe() {
            console.log('FindMe');
            GeoService
                .findMe()
                .then(function (position) {

                    console.log(position);

                    $scope.map = {
                        center: position.geolocation,
                        zoom: 13
                    };
                    vm.user = angular.copy(position.geolocation);
                });
        }

        function init() {
            GeoService
                .findMe()
                .then(function (position) {

                    console.log(position);

                    $scope.map = {
                        center: position.geolocation,
                        zoom: 13
                    };

                    vm.user = angular.copy(position.geolocation);

                    Photogram
                        .nearby(position.coords)
                        .then(function (resp) {
                            console.log(resp);
                            vm.data = resp;
                        });

                }, function (error) {
                    console.log('Could not get location');

                    Photogram
                        .nearby($scope.map.center)
                        .then(function (resp) {
                            console.log(resp);
                            vm.data = resp;
                        });
                });
        }

        init();

    }

})();