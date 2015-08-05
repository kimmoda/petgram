'use strict';
angular
    .module ('module.gallery')
    .controller ('GalleryCaptureCtrl', function ($scope, $cordovaGeolocation, PhotoService, ParseImageService, $state, Gallery, Notify) {
    var self = this;

    function init () {
        self.form    = {
            title : '',
            coords: '',
            photo : '',
            geo   : true
        };
        self.loading = false;
    }

    init ();

    var posOptions = {
        timeout           : 10000,
        enableHighAccuracy: false
    };

    $cordovaGeolocation
        .getCurrentPosition (posOptions)
        .then (function (position) {
        self.here        = {
            id    : 1,
            coords: {
                latitude : position.coords.latitude,
                longitude: position.coords.longitude,
            },
            icon  : 'img/pin.png'
        };
        self.form.coords = {
            latitude : position.coords.latitude,
            longitude: position.coords.longitude,
        };
        console.log (self.form);
        self.map.center  = self.here.coords;
        console.log (position);
    }, function (err) {
        // error
    });


    self.formFields = Gallery.form;

    self.open = function () {
        PhotoService
            .open ()
            .then (function (resp) {
            self.form.photo = resp;
            self.data       = 'data:image/jpeg;base64,' + resp;
            // angular.element('.title').focus();
        })
            .catch (function () {
            $state.go ('gallery.home');
        });
    };

    self.open ();

    self.submitCapture = function (rForm, form) {
        if (rForm.$valid) {
            var dataForm = angular.copy (self.form);
            self.loading = true;
            Gallery
                .add (dataForm)
                .then (function (resp) {
                $state.go ('gallery.home', {
                    reload: true
                });
                init ();
            });
        }
    };


    self.map = {
        center     : {
            latitude : -23.5333333,
            longitude: -46.6166667
        },
        scrollwheel: false,
        zoom       : 15
    };

});