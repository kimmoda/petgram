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
        .module('app.photogram')
        .controller('PhotogramAccountCtrl',PhotogramAccountController);

    function PhotogramAccountController(Parse, Photogram, User) {
        var vm       = this;
        vm.changeTab = changeTab;
        vm.user      = Parse.User.current();
        
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
                total: false,
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

            Photogram
                .getUserGalleryQtd()
                .then(function (qtdPhotos) {
                    console.log(qtdPhotos);
                    vm.user.qtdPhotos = qtdPhotos;
                    vm.loadingPhotos  = false;
                });

            User
                .getFollowers()
                .then(function (qtdFollowers) {
                    console.log('qtdFollower: seguindo', qtdFollowers);
                    vm.user.qtdFollowers = qtdFollowers;
                    vm.loadingFollowers  = false;
                });

            User
                .getFollowing()
                .then(function (qtdFollowing) {
                    console.log('qtdFollowing: seguidores', qtdFollowing);
                    vm.user.qtdFollowing = qtdFollowing;
                    vm.loadingFollowing  = false;
                });
        }

        

    }


})();
