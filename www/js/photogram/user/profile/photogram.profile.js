(function (window, angular, Parse, undefined) {
    'use strict';
    angular
        .module('app.photogram')
        .controller('PhotogramProfilePhoto', PhotogramProfilePhoto)
        .controller('PhotogramProfileCtrl', PhotogramProfileCtrl);

    function PhotogramProfilePhoto(Photogram, $scope) {
        var vm = this;
        var user = Parse.User.current();
        vm.data = [];
        vm.empty = false;

        console.log('Profile Photo');

        Photogram
            .getUserGallery(user.id)
            .then(function (resp) {
                vm.data = resp;
                console.log(resp);
            })
            .then(function () {
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$broadcast('scroll.infiniteScrollComplete');
                vm.loading = false;
            })
            .catch(function () {
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$broadcast('scroll.infiniteScrollComplete');
                vm.loading = false;
            });
    }


    function PhotogramProfileCtrl($scope, $rootScope, User, Photogram) {

        var vm = this;
        vm.loading = true;
        vm.empty = false;
        vm.data = [];
        vm.tab = 'grid';

        var user = $rootScope.user;


        function getFollower(userId) {
            $scope.loadingFollowers = true;
            $scope.loadingFollowing = true;
            $scope.loadingPhotos = true;

            Photogram
                .getUserGalleryQtd(userId)
                .then(function (qtdPhotos) {
                    console.log('qtdPhotos', qtdPhotos);
                    user.qtdPhotos = qtdPhotos;
                    $scope.loadingPhotos = false;
                    if (qtdPhotos > 0) {
                        console.log('Load photo');
                    } else {
                        console.log('No photo');
                        vm.empty = true;
                        vm.loading = false;
                    }
                });

            User
                .getFollowers(userId)
                .then(function (qtdFollowers) {
                    console.log('qtdFollower: seguindo', qtdFollowers);
                    user.qtdFollowers = qtdFollowers;
                    $scope.loadingFollowers = false;
                });

            User
                .getFollowing(userId)
                .then(function (qtdFollowing) {
                    console.log('qtdFollowing: seguidores', qtdFollowing);
                    user.qtdFollowing = qtdFollowing;
                    $scope.loadingFollowing = false;
                });
        }

        getFollower();


    }


})(window, window.angular, window.Parse);