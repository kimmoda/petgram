'use strict';
angular
    .module ('module.gallery')
    .controller ('GallerySearchCtrl', function ($scope, Gallery) {
        var self = this;

        self.load = function (force) {
            Gallery
                .all (force)
                .then (function (resp) {
                self.data = resp;
                console.log (resp);
                $scope.$broadcast ('scroll.infiniteScrollComplete');
            });
        };

        self.load ();

    });
