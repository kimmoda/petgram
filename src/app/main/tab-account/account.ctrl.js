(function () {
    'use strict';

    angular.module('app.main').controller('AccountCtrl', AccountController);

    function AccountController(User) {
        var vm       = this;
        vm.changeTab = changeTab;

        User.getPublicData(Parse.User.current()).then(function (user) {
            console.log('Profile', user.attributes);
            vm.user = user;
        });

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
