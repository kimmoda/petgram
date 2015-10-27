(function (window, angular, undefined) {
  'use strict';
  angular
    .module('module.gallery')
    .controller('GalleryProfileCtrl', GalleryProfileCtrl);

  function GalleryProfileCtrl($rootScope, $stateParams, Gallery, UserForm, User) {
    var vm = this;
    init();

    function init() {
      Gallery
        .getUser($stateParams.id)
        .then(function (resp) {
          vm.form = resp;
        });
    }
  }
})(window, window.angular);
