'use strict';
angular
    .module ('module.gallery')
    .controller ('GalleryAccountCtrl', function ($scope, $rootScope, $stateParams, Gallery) {

    var self        = this;
    self.loading    = true;
    self.data       = [];
    self.tab = 'grid';

    Gallery
        .getUser ($rootScope.user.id)
        .then (function (resp) {
        self.form = resp;
    });

    Gallery
        .getUserGallery ($rootScope.user.id)
        .then (function (resp) {
        self.data = resp;
        console.log (resp);
    })
        .then (function () {
        $scope.$broadcast ('scroll.refreshComplete');
        $scope.$broadcast ('scroll.infiniteScrollComplete');
        self.loading = false;
    });


});
