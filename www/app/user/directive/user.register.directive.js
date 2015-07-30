'use strict';
angular
    .module ('module.user')
    .directive ('userRegister', function ($ionicModal, User, UserForm, $state, Notify, $filter) {
    return {
        restrict: 'A',
        template: '',
        link    : function ($scope, elem, attr) {

            elem.bind ('click', function () {
                init ();
                $scope.modal.show ();
            });

            function init () {
                $scope.form = {
                    nome    : '',
                    email   : '',
                    mensagem: ''
                };
            }

            $ionicModal.fromTemplateUrl ('app/user/view/user.register.modal.html', {
                scope: $scope
            }).then (function (modal) {
                $scope.modal = modal;
            });

            $scope.formFields = UserForm.register;

            $scope.submitRegister = function (rForm, data) {

                console.log (rForm, data);
                if (rForm.$valid) {
                    var form      = angular.copy (data);
                    User
                        .register (form)
                        .then (function (resp) {
                        console.log (resp);
                        $scope.closeModal ();
                        $state.go ('app.home', {clear: true});
                    }).catch (function (resp) {
                        console.log (resp);
                        Notify.alert ('Ops', resp);
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