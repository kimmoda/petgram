(function () {
    'use strict';
    angular.module('starter').controller('SearchMapCtrl', SearchMapController);

    function SearchMapController($scope, $rootScope, $ionicLoading, $ionicModal,
                                 $state, $stateParams, $translate, $timeout, $localStorage, Toast, Gallery, Geolocation, Dialog) {


        $scope.maxRating = 5;
        $scope.storage   = $localStorage;
        $scope.params    = {
            location  : null,
            categoryId: $stateParams.categoryId,
            distance  : 100.00,
            page      : 0,
        };
        $scope.places    = [];

        var markers = [];

        function setPosition(lat, lng) {
            return new window.plugin.google.maps.LatLng(lat, lng);
        }

        var sideMenu           = document.getElementById('side-menu');
        var div                = document.getElementById('map_canvas');
        var map;
        var isLoadingViewShown = false;
        var isMapViewShown     = false;
        var isErrorViewShown   = false;

        if (window.cordova) {
            map = window.plugin.google.maps.Map.getMap(div);
            // Capturing event when Map load are ready.
            map.addEventListener(plugin.google.maps.event.MAP_READY, function () {
                map.setMyLocationEnabled(true);
                $timeout(function () {
                    map.refreshLayout();
                }, 1000)

                var mapType = plugin.google.maps.MapTypeId.ROADMAP
                if ($scope.storage.mapType === 'satellite') {
                    mapType = plugin.google.maps.MapTypeId.SATELLITE;
                }
                map.setMapTypeId(mapType);

                showLoading();

                Geolocation.getCurrentPosition().then(function (position) {

                    $scope.params.location = {
                        latitude : position.coords.latitude,
                        longitude: position.coords.longitude
                    }

                    loadGallerys();
                }, function (error) {

                    $scope.params.location = null;

                    var errorMessage;

                    if (error.code === 1 || error.code === 3) {
                        errorMessage = trans.errorGpsDisabledText;
                    } else {
                        errorMessage = trans.errorLocationMissingText;
                    }
                    Dialog.alert(errorMessage);

                });
            });
        }

        function showLoading() {
            isLoadingViewShown = true;
            isMapViewShown     = true;
            isErrorViewShown   = false;
        }

        function showMap() {
            isMapViewShown     = true;
            isLoadingViewShown = false;
            isErrorViewShown   = false;
            $ionicLoading.hide();
        }

        function setMapPosition(position) {
            map.moveCamera({
                target: setPosition(position.lat, position.lng),
                zoom  : 16,
            });
        }

        function animateCameraWithBounds(points) {

            if (points.length > 0) {
                var latLngBounds = new plugin.google.maps.LatLngBounds(points);

                map.moveCamera({
                    target: latLngBounds
                });
            }
        }

        function setMapZoomToFit() {
            var points = [];
            for (var i = 0; i < $scope.places.length; i++) {
                var place    = $scope.places[i];
                var position = setPosition(place.latitude, place.longitude);
                points.push(position);
            }
            points.push(setPosition(
                $scope.params.location.latitude,
                $scope.params.location.longitude));

            animateCameraWithBounds(points);
        }

        function setGallerys(places) {
            $scope.places = places;

            for (var i = 0; i < places.length; i++) {

                var place = places[i];

                var icon = '#E84545';

                if (place.category.get('icon')) {
                    icon = {
                        url : place.category.get('icon').url(),
                        size: {
                            width : 32,
                            height: 32,
                        }
                    }
                }

                map.addMarker({
                    place      : place,
                    position   : setPosition(place.latitude, place.longitude),
                    title      : place.title,
                    icon       : icon,
                    animation  : plugin.google.maps.Animation.DROP,
                    styles     : {
                        maxWidth: '80%'
                    },
                    snippet    : place.description,
                    placeId    : place.id,
                    markerClick: function (marker) {
                        marker.showInfoWindow();
                    },
                    infoClick  : function (marker) {
                        $state.go('app.place', {placeId: marker.get('placeId')});
                    }
                }, function (marker) {
                    markers.push(marker);
                });
            }
        }

        function loadGallerys() {

            Gallery.all($scope.params).then(function (places) {
                setGallerys(places);
                showMap();

                if (places.length === 0) {
                    Dialog.alert(trans.placesNotFoundText);
                } else {
                    setMapZoomToFit();
                }

            }, function () {
                Toast.show(trans.errorText);
            });
        }

        function removeGallerys() {
            $scope.places = [];
        }

        function removeMarkers() {
            for (var i = 0; i < markers.length; i++) {
                markers[i].remove();
            }
        };

        $scope.onSearchGallerys = function () {

            map.getCameraPosition(function (camera) {

                $scope.params.location.latitude  = camera.target.lat;
                $scope.params.location.longitude = camera.target.lng;

                showLoading();
                removeMarkers();
                removeGallerys();
                loadGallerys();
            });
        }

        $scope.showLoadingView = function () {
            return isLoadingViewShown;
        };

        $scope.showMap = function () {
            return isMapViewShown;
        };

        $scope.showErrorView = function () {
            return isErrorViewShown;
        };

        $scope.onReload = function () {
            //showLoading();
            //loadGallerys();
        };

        $scope.onGalleryClicked = function (place) {
            $scope.closeGallerysModal();

            for (var i = 0; i < markers.length; i++) {
                if (markers[i].get('place') === place) {
                    var marker = markers[i];
                    marker.showInfoWindow();
                    marker.getPosition(function (position) {
                        setMapPosition(position);
                    });
                }
            }
        };

        $scope.openGallerysModal = function () {
            map.setClickable(false);
            // Open profile
        };

        $scope.closeGallerysModal = function () {
            map.setClickable(true);
        };


        $scope.$on('$ionicView.leave', function () {
            if (window.cordova) {
                map.setMyLocationEnabled(false);
                map.setClickable(false);
                map.off();
            }
        });

        $scope.$on('$ionicView.beforeEnter', function () {
            if (window.cordova) {
                // Fix issue with side menu + google maps
                map.setMyLocationEnabled(true);
                map.setClickable(true);
            }
        });

        $rootScope.$on('$stateChangeStart', function (event, toState) {
            if (toState.name !== 'tab.map') {
                if (window.cordova) {
                    map.clear();
                    map.moveCamera({
                        target: setPosition(0.0, 0.0),
                        zoom  : 1
                    });
                }
            }
        });
    }

})();