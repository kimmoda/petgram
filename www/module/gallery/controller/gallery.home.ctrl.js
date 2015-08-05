'use strict';
angular
    .module ('module.gallery')
    .controller ('GalleryHomeCtrl', function ($scope, $ionicPopover, $stateParams, PhotoService, Gallery, $timeout) {
    var self     = this;
    self.page    = -1;
    self.active  = false;
    self.data    = [];
    self.loading = false;
    $scope.like  = false;

    $ionicPopover
        .fromTemplateUrl ('module/gallery/view/gallery.popover.home.html', {
        scope: $scope,
    })
        .then (function (popover) {
        console.log (popover);
        $scope.popover = popover;
    });


    $scope.loadMore = function (force) {
        console.log ('Load More');
        self.load (force);
    }

    self.load = function (force) {
        console.log ('Load ');
        self.loading = true;
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
            self.loading = false;
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