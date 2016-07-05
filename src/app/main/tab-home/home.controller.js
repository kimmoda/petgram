(function () {
    'use strict';

    angular.module('app.main').controller('HomeCtrl', HomeController);

    function HomeController($state) {
        var vm = this;

        vm.openProfile = function (username) {
            $state.go('tab.homeProfile', {username: username})
        };

        vm.openLikers = function (galleryId) {
            $state.go('tab.homeGalleryLikers', {galleryId: galleryId})
        };
    }


})();
