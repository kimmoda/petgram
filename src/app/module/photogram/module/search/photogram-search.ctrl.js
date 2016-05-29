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

    function PhotogramSearchCtrl($state) {
        var vm       = this;
        vm.changeTab = changeTab;

        vm.tab = {
            list: true,
            map: false
        };
        

        function changeTab(tab) {
            if (tab === 'list') {
                vm.tab = {
                    list: true,
                    map: false
                };
                $state.go('photogram.search.list');
            } else {
                vm.tab = {
                    list: false,
                    map: true
                };
                $state.go('photogram.search.map');
            }
        }

       
    }


})();