'use strict';
angular
    .module ('module.miscellaneous')
    .controller ('ImagePickerCtrl', function ($scope, $rootScope, $cordovaCamera) {

    $scope.images = [];

    $scope.selImages = function () {

        window.imagePicker.getPictures (
            function (results) {
                for (var i = 0; i < results.length; i++) {
                    console.log ('Image URI: ' + results[i]);
                    $scope.images.push (results[i]);
                }
                if (!$scope.$$phase) {
                    $scope.$apply ();
                }
            }, function (error) {
                console.log ('Error: ' + error);
            }
        );
    };

    $scope.removeImage = function (image) {
        $scope.images = _.without ($scope.images, image);
    };

    $scope.shareImage = function (image) {
        window.plugins.socialsharing.share (null, null, image);
    };

    $scope.shareAll = function () {
        window.plugins.socialsharing.share (null, null, $scope.images);
    };
})
