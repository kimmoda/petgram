(function () {
    'use strict';
    angular
        .module('module.gallery')
        .controller('GalleryUserListCtrl', function (User, Notify, $state) {
            var vm = this;

            User
                .list()
                .then(function (resp) {
                    vm.data = resp;
                    console.log(resp);
                });

            vm.submitFollow = function () {

                var users = vm.data.filter(function (item) {
                    return item.follow == true;
                });

                Notify.showLoading();
                User
                    .addFollows(users)
                    .then(function (resp) {
                        Notify.hideLoading();
                        console.log(resp);
                        $state.go('gallery.home', {clear: true});
                    });
                console.log(users);

            };
        });
})();