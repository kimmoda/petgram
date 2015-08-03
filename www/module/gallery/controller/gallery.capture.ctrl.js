'use strict';
angular
    .module ('module.gallery')
    .controller ('GalleryCaptureCtrl', function ($scope, PhotoService, $state, Gallery, Notify) {
    var self = this;

    self.form = {
        email   : '',
        password: ''
    };

    self.formFields = Gallery.form;

    self.upload = function () {
        //var options = CONST.CAMERA;
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

});
