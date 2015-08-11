'use strict';
angular
    .module ('module.gallery')
    .controller ('GalleryProfileCtrl', function ($rootScope, $stateParams, Gallery, UserForm, User) {

    console.log ($stateParams);

    var self = this;

    Gallery
        .getUser ($stateParams.id)
        .then (function (resp) {
        self.form = resp;
    });

});
