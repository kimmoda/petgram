'use strict';
angular
    .module ('module.gallery')
    .directive ('galleryLike', function (Gallery) {
    return {
        restrict: 'A',
        scope   : {
            ngModel: '='
        },
        template: '',
        link    : function ($scope, elem, attr) {
            elem.bind ('click', function () {

                console.log ($scope.ngModel);

                Gallery
                    .likeGallery ($scope.ngModel.id)
                    .then (function (resp) {
                    console.log (resp);
                    console.log (resp);
                });

                if ($scope.ngModel.liked === 0) {
                    $scope.ngModel.liked = 1;
                    $scope.ngModel.likes += 1;
                } else {
                    $scope.ngModel.liked = 0;
                    $scope.ngModel.likes -= 1;
                }

                $scope.$apply ();

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
