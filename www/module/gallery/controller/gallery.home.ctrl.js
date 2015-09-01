(function () {
    'use strict';
    angular
        .module('module.gallery')
        .controller('GalleryHomeCtrl', function ($scope, $rootScope, $ionicPopover, $stateParams, PhotoService, Gallery) {
            var vm      = this;
            vm.loading  = true;
            $scope.like = false;


            function init() {
                vm.data  = [];
                vm.page  = 0;
                vm.empty = false;
                vm.more  = false;
            }

            init();

            $rootScope.$on('gallery:reload', function () {
                vm.load(true);
            });


            $scope.loadMore = function (force) {
                console.log('Load More', vm.more);
                vm.load(force);
            };

            vm.load = function (force) {
                console.log('Load ');
                vm.loading = true;

                if (force) {
                    init();
                }

                Gallery
                    .all(vm.page)
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
            };

            vm.load($stateParams.reload);

        });
})();