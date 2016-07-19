(function () {
    'use strict';

    angular.module('app.main').controller('ProfileCtrl', ProfileController);

    function ProfileController(User, $state, $stateParams) {
        var vm       = this;
        vm.changeTab = changeTab;

        vm.loading = true;
        User.profile($stateParams.username).then(function (data) {
            console.log(data);
            console.log(Parse.User.current());
            vm.isMe    = Parse.User.current().id === data.id ? true : false;
            vm.user    = data;
            vm.loading = false;
        });

        vm.openFollowers = function () {
            console.log($state, $stateParams);
            switch ($state.current.name) {
                case 'tab.homeProfile':
                    $state.go('tab.homeProfileFollowers', {username: $stateParams.username});
                    break;
                case 'tab.activityProfile':
                    $state.go('tab.activityProfileFollowers', {username: $stateParams.username});
                    break;
            }
        };

        vm.openFollowing = function () {
            console.log($state, $stateParams);
            switch ($state.current.name) {
                case 'tab.homeProfile':
                    $state.go('tab.homeProfileFollowing', {username: $stateParams.username});
                    break;
                case 'tab.activityProfile':
                    $state.go('tab.activityProfileFollowing', {username: $stateParams.username});
                    break;
            }
        };

        vm.follow = function () {

            vm.loadingFollow = true;


            User.follow(vm.user.obj.id).then(function (resp) {
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