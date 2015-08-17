(function () {
    'use strict';
    angular
        .module('module.user')
        .controller('LoginCtrl', function ($scope, $ionicPopup, UserForm, $state, gettextCatalog, Notify, User) {
            var vm = this;

            function init() {
                vm.form = {
                    email   : '',
                    password: ''
                };
            }

            init();

            vm.formFields = UserForm.login;

            vm.submitLogin = function (rForm, data) {

                var form = angular.copy(data);
                if (rForm.$valid) {
                    User
                        .login(form)
                        .then(function (data) {
                            console.log(data);
                            $state.go('userlist');
                            init();
                        })
                        .catch(function (resp) {
                            Notify.alert({
                                title: 'Ops',
                                text : resp
                            });
                            init();
                        });
                } else {
                    return false;
                }
            };

            vm.forgotPass = function () {
                $scope.form = {
                    recovery: ''
                };

                $scope.erro = '';
                $ionicPopup.show({
                    scope   : $scope,
                    template: '<div class="popup-recovery"><form name="form.recovery" form-manager><label class="item item-input ion-email"><input type="email" ng-model="email" id="email" name="email" placeholder="{{ \'Digite seu email\' | translate }}" required ng-maxlength="80"></label><span class="error-msg">{{erro}}</span></form></div>',
                    title   : gettextCatalog.getString('Uma nova senha ser\xE1 enviada para o seu endere\xE7o de email:'),
                    buttons : [
                        {
                            text: gettextCatalog.getString('Cancel'),
                            type: 'button-calm'
                        },
                        {
                            text : gettextCatalog.getString('Send'),
                            type : 'button-positive',
                            onTap: function (e) {
                                if ($scope.form.recovery.$valid) {
                                    return $scope.form.recovery.email.$viewValue;
                                } else {
                                    //não permite o usuário fechar até ele digitar o email
                                    e.preventDefault();
                                    $scope.erro = gettextCatalog.getString('Invalid Email');
                                }
                            }
                        }
                    ]
                }).then(function (res) {
                    if (!angular.isUndefined(res)) {
                        var email = res;

                        Notify.showLoading();

                        User
                            .forgot(email)
                            .then(function (resp) {
                                console.log(resp);
                                vm.form.email = email;
                                Notify.hideLoading();
                            })
                            .catch(function (resp) {
                                Notify.alert({
                                    login: 'Ops',
                                    text : resp
                                });
                                Notify.hideLoading();
                            });
                    }
                });
            };
        });
})();