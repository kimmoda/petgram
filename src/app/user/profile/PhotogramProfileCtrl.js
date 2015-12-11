(function () {
  'use strict';
  /**
   * @ngdoc controller
   * @name PhotogramProfileCtrl
   *
   * @description
   * _Please update the description and dependencies._
   *
   * @requires $scope
   * */
  angular
    .module('app.user')
    .controller('PhotogramProfileCtrl', PhotogramProfileController);

  function PhotogramProfileController($stateParams, $scope, Photogram) {
    var vm = this;
    vm.changeTab = changeTab;

    init();
    changeTab('list');

    function changeTab(tab) {
      if (tab === 'list') {
        vm.tab = {
          list: true,
          grid: false
        };
      } else {
        vm.tab = {
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


})();
