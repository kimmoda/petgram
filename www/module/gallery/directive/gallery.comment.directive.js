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

            function init () {
                $scope.loading = true;
                Gallery
                    .getComments ($scope.gallery)
                    .then (function (resp) {
                    $scope.comments = resp;
                    $scope.loading = false;
                });

                $scope.form = {
                    galleryId: $scope.gallery,
                    text     : ''
                };
            }

            elem.bind ('click', function () {
                console.log ($scope.gallery);

                init ();

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
                    var dataForm   = angular.copy (form);
                    $scope.loading = true;
                    Gallery
                        .addComment (dataForm)
                        .then (function (resp) {
                        console.log (resp);
                        init ();
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