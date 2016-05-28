(function () {
    'use strict';
    /**
     * @ngdoc controller
     * @name PhotogramHomeCtrl
     *
     * @description
     * _Please update the description and dependencies._
     *
     * @requires $scope
     * */
    angular
        .module('app.photogram')
        .controller('PhotogramSearchCtrl', PhotogramSearchCtrl);

    function PhotogramSearchCtrl($scope, GeoService, $timeout, Photogram) {
        var vm       = this;
        vm.changeTab = changeTab;
        var time = 1;

        changeTab('list');

        function changeTab(tab) {
            if (tab === 'list') {
                vm.tab = {
                    list: true,
                    map: false
                };
            } else {
                vm.tab = {
                    list: false,
                    map: true
                };
            }
        }

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

        function openModal(item) {
            console.log(item);
        }

        function location() {
            init();
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