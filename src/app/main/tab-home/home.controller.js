(function () {
    'use strict';

    angular.module('app.main').controller('HomeCtrl', HomeController);

    function HomeController($state) {
        var vm         = this;

        vm.openProfile = function (username) {
            $state.go('tab.homeProfile',{username: username})
        }
    }


})();
