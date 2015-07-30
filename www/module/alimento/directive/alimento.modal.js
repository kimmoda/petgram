'use strict';
angular
    .module ('module.alimento')
    .directive ('alimentoModal', function (Alimento, $ionicModal) {
    return {
        restrict: 'A',
        link    : function ($scope, elem) {
            elem.bind ('click', function () {

                console.log ($scope.item);
                $ionicModal.fromTemplateUrl ('module/alimento/view/alimento.modal.html', {
                    scope: $scope
                }).then (function (modal) {
                    $scope.modal = modal;
                    Alimento
                        .get ($scope.item._id)
                        .then (function (resp) {
                        $scope.data = resp;
                        $scope.modal.show ();
                    });
                });

            });

            $scope.closeModal = function () {
                $scope.modal.hide ();
                $scope.modal.remove ();
            };
        }
    }
});