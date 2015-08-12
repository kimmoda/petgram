'use strict';
angular
    .module ('module.gallery')
    .controller ('GalleryActivityCtrl', function (Gallery) {
    var self = this;
    self.loading = true;
    Gallery
        .listActivity ()
        .then (function (resp) {
        console.log (resp);
        self.data = resp;
        self.loading = false;
    });
});