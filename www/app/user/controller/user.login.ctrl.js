'use strict';
angular
    .module ('module.user')
    .controller ('LoginCtrl', function ($scope, $ionicPopup, UserForm, $state, gettextCatalog, Notify, User) {
    var self = this;

    self.form = {
        email   : '',
        password: ''
    };

    self.formFields = UserForm.login;

    self.submitLogin = function (rForm, data) {

        var form = angular.copy (data);
        if (rForm.$valid) {
            User
                .login (form)
                .then (function (data) {
                console.log (data);
                $state.go ('app.home');
            }).catch (function (resp) {
                Notify.alert ('Ops', resp);
            });
        } else {
            return false;
        }
    };

    self.forgotPass = function () {
        $scope.form = {recuperar: ''};
        $scope.erro = '';
        $ionicPopup.show ({
            scope   : $scope,
            template: '<div class="popup-recuperar"><form name="form.recuperar" form-manager><label class="item item-input ion-email"><input type="email" ng-model="email" id="email" name="email" placeholder="{{ \'Digite seu email\' | translate }}" required ng-maxlength="80"></label><span class="error-msg">{{erro}}</span></form></div>',
            title   : gettextCatalog.getString ('Uma nova senha ser\xE1 enviada para o seu endere\xE7o de email:'),
            buttons : [
                {
                    text: gettextCatalog.getString ('Cancelar'),
                    type: 'button-calm'
                },
                {
                    text : gettextCatalog.getString ('Enviar'),
                    type : 'button-positive',
                    onTap: function (e) {
                        if ($scope.form.recuperar.$valid) {
                            return $scope.form.recuperar.email.$viewValue;
                        } else {
                            //não permite o usuário fechar até ele digitar o email
                            e.preventDefault ();
                            $scope.erro = gettextCatalog.getString ('Email Inválido');
                        }
                    }
                }
            ]
        }).then (function (res) {
            if (!angular.isUndefined (res)) {
                var email = res;

                Notify.showLoading ();

                User
                    .forgot (email)
                    .then (function (resp) {
                    console.log (resp);
                    Notify.hideLoading ();
                })
                    .catch (function (resp) {
                    Notify.alert ('Ops', resp);
                    Notify.hideLoading ();
                });
            }
        });
    };
});