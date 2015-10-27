(function (window, angular, undefined) {
  'use strict';
  angular
    .module('module.gallery')
    .controller('GalleryViewCtrl', GalleryViewCtrl);

  function GalleryViewCtrl(Gallery, $stateParams) {
    var vm = this;
    Gallery
      .get($stateParams.id)
      .then(function (resp) {
        console.log(resp);
        vm.data = resp;
      });
  }

})(window, window.angular);
