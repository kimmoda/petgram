'use strict';
angular
    .module ('module.gallery')
    .controller ('GalleryPreviewCtrl', function (photo, Gallery, $stateParams) {
    var self  = this;
    self.data = photo;
    console.log (photo);
});
