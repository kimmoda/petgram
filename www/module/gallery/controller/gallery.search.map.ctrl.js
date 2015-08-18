'use strict';
angular
    .module('module.gallery')
    .controller('GallerySearchMapCtrl', function ($scope, User, Notify, Gallery) {
        var vm = this;
        Notify.showLoading();

        vm.map = {
            center: {
                latitude : 45,
                longitude: -73
            },
            zoom  : 13
        };

        vm.location = function () {
            init();
        };


        function init() {
            User
                .location()
                .then(function (position) {

                    console.log(position);

                    vm.map.center = {
                        latitude : position.latitude,
                        longitude: position.longitude
                    };

                    Gallery
                        .nearby(position.coords)
                        .then(function (resp) {
                            console.log(resp);
                            vm.data = resp;
                            Notify.hideLoading();
                        });

                }, function (error) {
                    console.log('Could not get location');
                });
        }

        init();

    });