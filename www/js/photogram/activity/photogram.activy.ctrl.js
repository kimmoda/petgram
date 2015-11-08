(function (window, angular, undefined) {
    'use strict';
    angular
        .module('app.photogram')
        .controller('PhotogramActivityCtrl', PhotogramActivityCtrl);

    function PhotogramActivityCtrl($scope, Photogram, PhotogramShare) {
        var vm     = this;
        vm.loading = true;

        $scope.loadMore = loadMore;
        vm.openShare    = PhotogramShare.open;
        vm.load         = load;
        init();
        vm.load();

        function init() {
            vm.page     = 0;
            vm.data     = [];
            vm.empty    = false;
            vm.loadMore = false;
        }

        function loadMore(force) {
            console.log('Load More');
            vm.load(force);
        }

        function load(force) {

            if (force) {
                init();
            }

            Photogram
                .listActivity(vm.page)
                .then(function (resp) {
                    console.log(resp);
                    angular.forEach(resp, function (value, key) {
                        vm.data.push(value);
                    });

                    console.log('qtd', resp.length);
                    if (resp.length) {
                        vm.loading = false;
                        vm.more    = true;
                        vm.page++;
                    } else {
                        vm.empty   = true;
                        vm.loading = false;
                        vm.more    = false;
                    }
                })
                .then(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                })
                .catch(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    if (vm.data.length) {
                        vm.loading = false;
                        vm.page++;
                    } else {
                        vm.empty   = true;
                        vm.loading = false;
                    }
                    vm.more = false;
                });
        }


    }

})(window, window.angular);