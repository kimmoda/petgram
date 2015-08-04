'use strict';
angular
    .module ('module.gallery')
    .controller ('GalleryCaptureCtrl', function ($scope, $cordovaGeolocation, PhotoService, $state, Gallery, Notify) {
    var self = this;

    self.form = {
        title   : '',
        position: '',
        geo: true
    };

    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        self.here = {
          id: 1,
          coords: {
            latitude :position.coords.latitude,
            longitude: position.coords.longitude,
          },
          icon: 'img/pin.png'
        };
        self.map.center = self.here.coords;
        console.log(position);
      }, function(err) {
        // error
      });


    self.formFields = Gallery.form;

    self.upload = function () {
        PhotoService
            .open()
            .then(function (resp) {
                self.data = 'data:image/jpeg;base64,' +resp;
            })
						.catch(function(){
							$state.go('app.gallery.home');
						});
    };

    self.upload ();


    self.map  = {
       center     : {
           latitude : -23.5333333,
           longitude: -46.6166667
       },
       scrollwheel: false,
       zoom       : 15
   };

});
