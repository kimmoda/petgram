(function () {
    'use strict';

    angular.module('starter').directive('albumPhotoGrid', albumPhotoGridDirective);

    function albumPhotoGridDirective(AppConfig, Gallery, $ionicModal, $rootScope) {

        return {
            restrict: 'A',
            scope   : {
                album: '='
            },
            link    : albumPhotoGridCtrl
        };

        function albumPhotoGridCtrl($scope, elem, attr) {

            elem.bind('click', function () {
                $scope.theme = AppConfig.theme;

                if (!$scope.album) {
                    return false;
                }

                $ionicModal.fromTemplateUrl('app/directive/albumPhotoGridDirective.html', {
                    scope: $scope,
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });

                $scope.closeModal = function () {
                    $scope.modal.hide();
                };
                // Cleanup the modal when we're done with it!
                $scope.$on('$destroy', function () {
                    $scope.modal.remove();
                });

                Gallery.getAlbum({id: $scope.album}).then(function (data) {
                    console.log(data);
                    $scope.title = data.album.attributes.title;
                    $scope.data  = data.photos;
                });

            })
        }

    }


})();
