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
    .controller('PhotogramHomeCtrl', PhotogramHomeController);

  function PhotogramHomeController($scope, $rootScope, $cordovaInAppBrowser, $stateParams, Photogram) {
    var vm = this;
    vm.loading = true;
    vm.load = load;
    vm.load($stateParams.reload);
    vm.loadMore = loadMore;

    init();

    $rootScope.$on('PhotogramHome:reload', function () {
      loadMore(true);
    });

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


    function load(force) {
      // console.log('Load ');

      if (force) {
        init();
      }

      Photogram
        .home(vm.page)
        .then(function (resp) {

          // console.log(resp);

          vm.loading = false;

          resp.galleries.map(function (item) {
            item.progress = false;
            // console.table(item);
            vm.data.push(item);
          });

          // console.log('qtd', resp.length);

          if (resp.length) {
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


})();