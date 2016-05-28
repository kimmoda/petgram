(function () {
    'use strict';
    /**
     * @ngdoc controller
     * @name PhotogramHomeCtrl
     *
     * @description
     * _Please update the description and dependencies._
     *
     * @requires $scope
     * */
    angular
        .module('app.photogram')
        .controller('PhotogramSearchCtrl', PhotogramSearchCtrl);

    function PhotogramSearchCtrl($scope, $rootScope, $stateParams, Photogram) {
        var vm     = this;
        vm.changeTab = changeTab;

        changeTab('list');

        function changeTab(tab) {
            if (tab === 'list') {
                vm.tab = {
                    list: true,
                    map: false
                };
            } else {
                vm.tab = {
                    list: false,
                    map: true
                };
            }
        }


    }


})();