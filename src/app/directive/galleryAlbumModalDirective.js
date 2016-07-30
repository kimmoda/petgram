(function () {
    'use strict';

    angular.module('starter').directive('galleryAlbumModal', galleryAlbumModalDirective);

    function galleryAlbumModalDirective($ionicModal, $q, GalleryAlbum) {
        return {
            restrict: 'A',
            link    : galleryAlbumModalLink,
            scope   : {
                ngModel: '='
            }
        };

        function galleryAlbumModalLink($scope, elem, attr) {

            elem.bind('click', openModal);

            function openModal() {
                var defer = $q.defer();

                $scope.loading = true;

                $scope.params      = {};
                $scope.params.page = 0;
                GalleryAlbum.list($scope.params).then(function (data) {
                    $scope.data    = data;
                    $scope.loading = false;
                })

                $ionicModal.fromTemplateUrl('app/directive/galleryAlbumModalDirective.html', {
                    scope          : $scope,
                    focusFirstInput: true
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });

                $scope.$on('selectAlbum', function (event, album) {
                    console.log('selectAlbum', event);
                    console.log('selectAlbum', album);
                    $scope.ngModel = album;
                    $scope.closeModal();
                });


                $scope.closeModal = function () {
                    $scope.modal.hide();
                };

                // Cleanup the modal when we're done with it!
                $scope.$on('$destroy', function () {
                    $scope.modal.remove();
                });

                $scope.selectAlbum = function (album) {
                    $scope.ngModel = album;
                    $scope.closeModal();
                };

                return defer.promise;
            }

        }
    }

})();