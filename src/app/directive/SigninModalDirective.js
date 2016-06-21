(function () {
    'use strict';

    angular.module('starter').directive('signinModal', signinModalDirective);

    function signinModalDirective($ionicModal, Loading, Auth, $state, Toast, UserForm, AppConfig, $rootScope) {
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
                    if (!rForm.$invalid) {
                        Loading.start();

                        console.log(form);
                        Auth.logIn(form).then(function (data) {
                            console.log(data, data.attributes);
                            $rootScope.currentUser = data;
                            console.log(Auth.getLoggedUser().name);
                            if (Auth.getLoggedUser()) {
                                $state.go($scope.routeLogged, {
                                    clear: true
                                });
                            } else {
                                $state.go('useravatar', {
                                    clear: true
                                });
                            }
                            $scope.closeModal();
                            Loading.end();
                        }).catch(function (resp) {
                            Toast.alert({
                                title: 'Ops',
                                text : resp.message
                            });
                            Loading.end();
                        });
                    } else {
                        return false;
                    }
                };

                $ionicModal.fromTemplateUrl('app/directive/SigninModalDirective.html', {
                    scope    : $scope,
                    animation: 'slide-in-up',
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