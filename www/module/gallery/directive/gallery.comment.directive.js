'use strict';
angular
    .module ('module.gallery')
    .directive ('galleryComment', function ($ionicModal, Gallery) {
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
                    .getComments ($scope.gallery)
                    .then (function (resp) {
                    $scope.comments = resp;
                });

                $scope.form = {
                    galleryId: $scope.gallery,
                    text     : ''
                };


                $ionicModal.fromTemplateUrl ('module/gallery/view/gallery.comment.directive.html', {
                    scope: $scope
                }).then (function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show ();
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