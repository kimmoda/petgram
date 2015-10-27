(function (window, angular, undefined) {
  'use strict';
  angular
    .module('module.gallery')
    .controller('GalleryUserListCtrl', GalleryUserListCtrl);

  function GalleryUserListCtrl(User, Loading, $state) {
    var vm = this;
    vm.submitFollow = submitFollow;

    function submitFollow() {

      var users = vm.data.filter(function (item) {
        return item.follow == true;
      });

      Loading.start();

      User
        .addFollows(users)
        .then(function (resp) {
          Loading.end();
          console.log(resp);
          $state.go('gallery.home', {
            clear: true
          });
        });
      console.log(users);
    }

    User
      .list()
      .then(function (resp) {
        vm.data = resp;
        console.log(resp);
      });
  }
})(window, window.angular);
