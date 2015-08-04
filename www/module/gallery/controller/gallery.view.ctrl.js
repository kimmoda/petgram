'use strict';
angular
    .module ('module.gallery')
    .controller ('GalleryViewCtrl', function (Gallery, $stateParams) {
    var self = this;
    Gallery
        .get ($stateParams.id)
        .then (function (resp) {
        console.log (resp);
        self.data = resp;
    });
});
