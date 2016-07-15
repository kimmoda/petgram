(function () {
    'use strict';

    angular.module('starter').directive('signinModal', signinModalDirective);

    function signinModalDirective($ionicModal, Loading, User, $state, Toast, UserForm, AppConfig, $rootScope) {
        return {
            restrict: 'A',
            link    : signinModalLink,
        };

        function signinModalLink($scope, elem, attr) {
            elem.bind('click', function () {

                $scope.formFields  = UserForm.login;
                $scope.routeLogged = AppConfig.routes.home;

                $scope.form = {
                    username: '',
                    password: ''
                };

                $scope.submitLogin = function (rForm, data) {
                    var form = angular.copy(data);
                    if (rForm.$valid) {
                        Loading.start();
                        User.signIn(form).then(function (data) {
                            console.log(data);
                            $rootScope.currentUser = data;
                            $state.go($scope.routeLogged, {
                                clear: true
                            });
                            $scope.closeModal();
                            Loading.end();
                        }).catch(function (resp) {
                            Toast.alert({
                                title: 'Error',
                                text : 'Incorrect username or password'
                            });
                            Loading.end();
                        });
                    } else {
                        return false;
                    }
                };

                $ionicModal.fromTemplateUrl('app/directive/SigninModalDirective.html', {
                    scope          : $scope,
                    animation      : 'slide-in-up',
                    focusFirstInput: true,
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
            });
        }
    }

})();