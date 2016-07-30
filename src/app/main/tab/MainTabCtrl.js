(function () {
    'use strict';

    angular.module('app.main').controller('MainTabCtrl', MainTabController);

    function MainTabController($localStorage, $scope, PhotoService, $ionicPlatform, Gallery, ParseFile, Loading) {
        var vm = this;

        $scope.storage = $localStorage;

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
