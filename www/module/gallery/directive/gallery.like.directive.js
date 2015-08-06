'use strict';
angular
    .module ('module.gallery')
    .directive ('galleryLike', function ($ionicModal, Gallery) {
    return {
        restrict: 'A',
        scope   : {
            gallery: '@'
        },
        template: '',
        link    : function ($scope, elem, attr) {
            elem.bind ('click', function () {
                console.log ($scope.gallery);

                Gallery
                    .likeGallery ($scope.gallery)
                    .then (function (resp) {
                    $scope.likes = resp;
                });

            });


            $scope.formFields    = Gallery.formComment;
            $scope.submitComment = function (rForm, form) {
                if (rForm.$valid) {
                    var dataForm = angular.copy (form);
                    Gallery
                        .addComment (dataForm)
                        .then (function (resp) {
                        console.log (resp);
                        $scope.closeModal ();
                    });
                }
            };

            $scope.closeModal = function () {
                $scope.modal.hide ();
                $scope.modal.remove ();
            };
        }
    }
});
