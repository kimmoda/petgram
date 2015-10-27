(function (window, angular, undefined) {
  'use strict';
  angular
    .module('module.gallery')
    .controller('GallerySearchGridCtrl', GallerySearchGridCtrl);

  function GallerySearchGridCtrl($scope, Gallery) {
    var vm = this;
    vm.loading = true;
    $scope.loadMore = loadMore;
    vm.load = load;
    vm.load('');
    init();

    function init() {
      vm.data = [];
      vm.page = 0;
      vm.empty = false;
      vm.more = false;
    }

    function loadMore(force) {
      console.log('Load More', vm.more);
      vm.load(force);
    }

    function load(string) {
      console.log('load ', string);
      Gallery
        .search(string, vm.page)
        .then(function (resp) {
          vm.loading = false;

          angular.forEach(resp, function (value, key) {
            vm.data.push(value);
          });

          console.log('qtd', resp.length);

          if (resp.length > 0) {
            vm.more = true;
            vm.page++;
          } else {
            vm.empty = true;
            vm.more = false;
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
            vm.empty = true;
            vm.loading = false;
          }
          vm.more = false;
        });
    }

  }
})(window, window.angular);
