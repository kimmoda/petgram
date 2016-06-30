(function () {
    'use strict';

    angular.module('app.main').controller('ProfileCtrl', ProfileController);

    function ProfileController(User, $stateParams) {
        var vm       = this;
        vm.changeTab = changeTab;

        vm.loading = true;
        User.profile($stateParams.username).then(function (data) {
            console.log(data);
            console.log(Parse.User.current().attributes.username);
            vm.user = data;
        });

        vm.follow = function () {

            vm.loadingFollow = true;
            
            
            User.follow(vm.user.userObj.id).then(function (resp) {
                console.log('Follow result', resp);
                vm.user.isFollow = (resp === 'follow') ? true : false;
                if (resp == 'follow') {
                    vm.user.followersTotal += 1;
                }
                if (resp == 'unfollow') {
                    vm.user.followersTotal -= 1;
                }
                vm.loadingFollow = false;
            });


        }

        init();
        changeTab('grid');

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
            vm.data  = {
                total    : false,
                galleries: []
            };
            vm.page  = 0;
            vm.empty = false;
            vm.more  = false;
        }


    }


})();
