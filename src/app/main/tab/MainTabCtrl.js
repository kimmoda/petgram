(function () {
    'use strict';

    angular.module('app.main').controller('MainTabCtrl', MainTabController);

    function MainTabController($localStorage, $scope, $timeout, $cordovaSplashscreen, $ionicPlatform, ActionSheet, $q, Gallery, PhotoFilter, ParseFile, $ionicModal, Loading, Toast) {
        var vm = this;
        var tempImage;

        $scope.storage = $localStorage;

        $scope.$on('$ionicView.loaded', function () {
            $ionicPlatform.ready(function () {
                if (navigator && navigator.splashscreen) {
                    $cordovaSplashscreen.hide();
                    window.StatusBar.styleDefault();
                }
            });
        });

        vm.postPhoto = function () {
            ActionSheet
                .image()
                .then(function (image) {
                    tempImage = image;
                    //return PhotoFilter.load(image);
                    return image;
                })
                .then(modalPost)
                .then(function (form) {
                    //console.log('Cadastra na Galeria', form);
                    Loading.start();
                    ParseFile.upload({base64: form.image}).then(function (imageUploaded) {
                        form.image = imageUploaded;
                        Gallery.create(form).then(function (item) {
                            $scope.$emit('photoInclude', item);
                            Loading.end();
                        });
                    });
                });


            function modalPost(image) {
                var defer    = $q.defer();
                $scope.image = image;
                $scope.form  = {
                    title: ''
                };

                if (window.cordova) {
                    var div = document.getElementById('map_canvas2');
                    var map = plugin.google.maps.Map.getMap(div);
                    var marker;

                    $scope.onScroll = function () {
                        if (map) {
                            map.refreshLayout();
                        }
                    }

                    $scope.onSearchAddress = function () {

                        var req = {address: $scope.form.address};

                        if (req.address) {

                            plugin.google.maps.Geocoder.geocode(req, function (results) {

                                if (results.length) {
                                    var result   = results[0];
                                    var position = result.position;

                                    $scope.form.location = position;

                                    if (!marker) {
                                        map.addMarker({
                                            position: position
                                        }, function (marker1) {
                                            marker = marker1;
                                            map.moveCamera({
                                                target: position,
                                                zoom  : 16
                                            });
                                        });
                                    } else {
                                        marker.setPosition(position);
                                        map.moveCamera({
                                            target: position,
                                            zoom  : 16
                                        });
                                    }
                                } else {
                                    Toast.show('Not result');
                                }
                            });
                        }
                    }

                    // Capturing event when Map load are ready.
                    map.addEventListener(plugin.google.maps.event.MAP_READY, function () {
                        map.setMyLocationEnabled(true);
                        $timeout(function () {
                            map.refreshLayout();
                        }, 1000);

                        var mapType = plugin.google.maps.MapTypeId.ROADMAP
                        if ($scope.storage.mapType === 'satellite') {
                            mapType = plugin.google.maps.MapTypeId.SATELLITE;
                        }
                        map.setMapTypeId(mapType);
                    });

                    var toLatLng = function (lat, lng) {
                        return new plugin.google.maps.LatLng(lat, lng);
                    };

                    var onCameraChange = function (position) {
                        if (marker) {
                            var latLng = toLatLng(position.target.lat, position.target.lng);
                            marker.setPosition(latLng);
                            $scope.form.location = position.target;
                        }
                    }

                    $scope.$on('$ionicView.leave', function () {

                        if (map) {
                            map.setMyLocationEnabled(false);
                            map.setClickable(false);
                            map.off();
                            map.clear();
                            map.moveCamera({
                                target: toLatLng(0.0, 0.0),
                                zoom  : 1
                            });
                        }
                    });

                    $scope.$on('$ionicView.beforeEnter', function () {

                        if (map) {
                            map.setMyLocationEnabled(true);
                            map.setClickable(true);
                            map.on(plugin.google.maps.event.CAMERA_CHANGE, onCameraChange);
                        }
                    });
                }

                $scope.editFilter = function () {
                    PhotoFilter.load(tempImage).then(function (image) {
                        $scope.image = image;
                    });
                };

                $ionicModal.fromTemplateUrl('app/main/share/share-modal.html', {
                    scope          : $scope,
                    focusFirstInput: true
                }).then(function (modal) {
                    $scope.modalFilter = modal;
                    $scope.modalFilter.show();
                });


                $scope.close = function () {
                    $scope.modalFilter.hide();
                };

                // Cleanup the modal when we're done with it!
                $scope.$on('$destroy', function () {
                    $scope.modal.remove();
                });

                $scope.submit = function () {
                    var form   = angular.copy($scope.form);
                    form.image = $scope.image;
                    tempImage  = '';
                    $scope.close();
                    defer.resolve(form);
                };

                return defer.promise;
            }
        };

    }
})();
