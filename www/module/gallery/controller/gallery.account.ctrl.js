'use strict';
angular
    .module ('module.gallery')
    .controller ('GalleryAccountCtrl', function ($scope, $rootScope, $stateParams, Gallery) {

    var self = this;

    self.currentTab = 'module/gallery/view/gallery.photos.grid.html';

    Gallery
        .getUser ($rootScope.user.id)
        .then (function (resp) {
        self.form = resp;
    });

    self.tab = function (type) {
        self.currentTab = 'module/gallery/view/gallery.photos.' + type + '.html';

        console.log (self.currentTab);
    };

    Gallery
        .getUserGallery ($rootScope.user.id)
        .then (function (resp) {
        $scope.data = resp;
    });


});
