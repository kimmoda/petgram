(function (window, angular, undefined) {
    'use strict';
    angular
        .module('app.user')
        .controller('PhotogramProfileCtrl', PhotogramProfileCtrl);

    function PhotogramProfileCtrl($stateParams, $scope, Photogram) {
        var vm = this;
        vm.changeTab = changeTab;

        init();
        changeTab('list');

        function changeTab (tab) {
            if(tab ==='list') {
                vm.tab ={
                    list: true,
                    grid: false
                };
            } else {
                vm.tab ={
                    list: false,
                    grid: true
                };
            }
        }

        function init() {
            Photogram
                .getUser($stateParams.id)
                .then(function (resp) {
                    vm.form = resp;
                    getGallery(resp);
                });
        }

        function getGallery(user) {
            vm.loading = true;

            Photogram
                .getUserGallery(user.id)
                .then(function (resp) {
                    vm.data = resp;
                    console.log(resp);
                })
                .then(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    vm.loading = false;
                })
                .catch(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    vm.loading = false;
                });
        }
    }

})(window, window.angular);