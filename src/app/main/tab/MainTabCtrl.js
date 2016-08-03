(function () {
    'use strict';

    angular.module('app.main').controller('MainTabCtrl', MainTabController);

    function MainTabController($localStorage, ParsePush, $scope, $rootScope, PhotoService, $ionicPlatform, Gallery, ParseFile, Loading) {
        var vm = this;

        $scope.storage = $localStorage;
        function clearBadge() {
            $scope.badge = 0;
        }

        clearBadge();

        $rootScope.$on('activity:clear', function () {
            clearBadge();
        })

        $ionicPlatform.ready(function () {

            ParsePush.init().then(function () {
                ParsePush.on('openPN', function (pn) {
                    console.log('The user opened a notification:' + JSON.stringify(pn));
                    $scope.$applyAsync();
                });

                ParsePush.on('receivePN', function (pn) {
                    console.log('yo i got this push notification:' + JSON.stringify(pn));
                    $scope.badge++;
                    $scope.$applyAsync();
                });

                ParsePush.on('receivePN', function (message) {
                    console.log('message', message);
                    $scope.$applyAsync();
                });
            })
        });

        vm.postPhoto = function () {
            var options = {
                jrCrop     : true,
                filterImage: true
            }
            PhotoService.open(options).then(PhotoService.modalPost).then(function (form) {
                Loading.start();
                ParseFile.upload({base64: form.image}).then(function (imageUploaded) {
                    form.image = imageUploaded;
                    Gallery.create(form).then(function (item) {
                        $scope.$emit('photoInclude', item);
                        Loading.end();
                    });
                });
            });
        };

    }
})();
