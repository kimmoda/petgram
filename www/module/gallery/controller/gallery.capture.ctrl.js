'use strict';
angular
    .module ('module.gallery')
    .controller ('GalleryCaptureCtrl', function ($scope, $cordovaGeolocation, PhotoService, ParseImageService, $state, Gallery, Notify) {
    var self = this;

    function init () {
        self.active = false;
        self.form   = {
            title   : '',
            location: '',
            photo   : '',
            geo     : false
        };

        self.map     = {
            center     : {
                latitude : -23.5333333,
                longitude: -46.6166667
            },
            scrollwheel: false,
            zoom       : 15
        };
        self.data    = '';
        self.loading = false;

    }

    function getLocation () {
        var posOptions = {
            timeout           : 10000,
            enableHighAccuracy: false
        };

        if (self.form.location === '') {

            self.loading = false;

            $cordovaGeolocation
                .getCurrentPosition (posOptions)
                .then (function (position) {

                self.here = {
                    id    : 1,
                    coords: {
                        latitude : position.coords.latitude,
                        longitude: position.coords.longitude,
                    },
                    icon  : 'img/pin.png'
                };

                self.form.location = {
                    latitude : position.coords.latitude,
                    longitude: position.coords.longitude,
                };

                self.map.center = self.here.coords;
                self.loading    = false;

                console.log (self.form);
                console.log (self.here);
                console.log (position);
            }, function (err) {
                // error
            });
        }


    };


    self.getGeo = function (resp) {
        if (resp) getLocation ();
    };

    self.formFields = Gallery.form;

    self.open = function () {
        init ();
        PhotoService
            .open ()
            .then (function (resp) {
            self.loading    = false;
            self.active     = true;
            self.form.photo = resp;
            self.data       = 'data:image/jpeg;base64,' + resp;
            // angular.element ('.title').focus ();
        })
            .catch (function () {
            $state.go ('gallery.home');
        });
    };

    self.open ();

    self.submitCapture = function (form) {
        var dataForm = angular.copy (self.form);

        Gallery
            .add (dataForm)
            .then (function (resp) {
            $state.go ('gallery.home', {
                reload: true
            });
            init ();
        });
    };


});