'use strict';
angular
    .module ('module.gallery')
    .controller ('GalleryHomeCtrl', function ($scope, $stateParams, PhotoService, Gallery, $timeout) {
    var self    = this;
    self.page   = -1;
    self.active = false;
    self.data   = [];

    $scope.loadMore = function (force) {
        console.log ('Load More');
        self.load (force);
    }

    self.load = function (force) {
        console.log ('Load ');
        if (force) {
            self.data = [];
            self.page = -1;
        }

        self.page = parseInt (self.page) + 1;
        Gallery
            .all (self.page)
            .then (function (resp) {
            console.log (resp);
            angular.forEach (resp, function (value, key) {
                self.data.push (value);
            });
        })
            .then (function () {
            $scope.$broadcast ('scroll.refreshComplete');
            $scope.$broadcast ('scroll.infiniteScrollComplete');
        });
    };

    self.upload = function () {
        PhotoService
            .open ()
            .then (function (resp) {
            console.log (resp);
        });
    };

    self.load ($stateParams.reload);

});