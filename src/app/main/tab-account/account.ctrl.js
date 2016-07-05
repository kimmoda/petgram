(function () {
    'use strict';

    angular.module('app.main').controller('AccountCtrl', AccountController);

    function AccountController(User, $state, $rootScope) {
        var vm       = this;
        vm.changeTab = changeTab;

        vm.user  = $rootScope.currentUser;
        vm.photo = $rootScope.currentUser.attributes.photo;

        vm.loading = true;
        User.getPublicData(Parse.User.current()).then(function (user) {
            console.log('Profile', user.attributes);
            vm.user    = user;
            vm.loading = false;
        });

        vm.openFollowers = function () {
            $state.go('tab.accountFollowers', {username: $rootScope.currentUser.attributes.username});
        };

        vm.openFollowing = function () {
            $state.go('tab.accountFollowing', {username: $rootScope.currentUser.attributes.username});
        };

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
            getFollower();
        }

        function getFollower() {
            vm.loadingFollowers = true;
            vm.loadingFollowing = true;
            vm.loadingPhotos    = true;
        }


    }


})();
