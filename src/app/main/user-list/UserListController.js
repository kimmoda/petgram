(function () {
    'use strict';
    angular.module('starter').controller('UserListCtrl', UserListController);

    function UserListController(User, $stateParams, $state) {
        var vm     = this;
        vm.loading = true;
        User.list().then(function (data) {
            console.log(data);
            vm.users   = data;
            vm.loading = false;
        });

        vm.openProfile = function (user) {
            console.log('user', user);
            $state.go('tab.homeProfile', {username: user.username})
        };


        vm.follow = function (user) {

            vm.loadingFollow = true;
            User.follow(user.userObj.id).then(function (resp) {
                console.log('Follow result', resp);
                user.isFollow = (resp === 'follow') ? true : false;
                if (resp == 'follow') {
                    user.followersTotal += 1;
                }
                if (resp == 'unfollow') {
                    user.followersTotal -= 1;
                }
                vm.loadingFollow = false;
            });


        }
    }

})();