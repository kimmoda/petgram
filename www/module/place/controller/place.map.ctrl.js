'use strict';
angular
    .module ('module.place')
    .controller ('PlaceMapCtrl', function ($scope, Loading) {
    var self             = this;
    $scope.info_position = {
        lat: 43.07493,
        lng: -89.381388
    };

    $scope.center_position = {
        lat: 43.07493,
        lng: -89.381388
    };

    $scope.my_location = "";

    $scope.$on ('mapInitialized', function (event, map) {
        $scope.map = map;
    });

    $scope.centerOnMe = function () {
        $scope.positions = [];

        Loading.show ();

        // with this function you can get the user’s current position
        // we use this plugin: https://github.com/apache/cordova-plugin-geolocation/
        navigator.geolocation.getCurrentPosition (function (position) {
            var pos                 = new google.maps.LatLng (position.coords.latitude, position.coords.longitude);
            $scope.current_position = {lat: pos.k, lng: pos.D};
            $scope.my_location      = pos.k + ", " + pos.D;
            $scope.map.setCenter (pos);
            Loading.hide ();
        });
    };
});