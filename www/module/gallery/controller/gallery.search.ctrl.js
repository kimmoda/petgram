'use strict';
angular
    .module ('module.gallery')
    .controller ('GallerySearchCtrl', function ($scope, Gallery) {
        var self = this;
        self.loading = true;
        self.load = function (force) {
            Gallery
                .search (force)
                .then (function (resp) {
                self.data = resp;
                console.log (resp);
            })
            .then (function () {
              $scope.$broadcast ('scroll.refreshComplete');
              $scope.$broadcast ('scroll.infiniteScrollComplete');
              self.loading = false;
            });
        };

        self.load ();

    });
