(function(){
    'use strict';
    angular
        .module('module.user')
        .directive('buttonForgotPass', function (User, $ionicPopup, gettextCatalog, Notify) {
            return {
                restrict: 'E',
                template: '<button class="button button-right button-block button-clear" ng-click="forgotPass()" translate>Forgot your password?</button>',
                scope   : {
                    login   : '@',
                    register: '@',
                },
                link    : function ($scope, elem, attr) {

                    elem.bind('click', function () {

                        $scope.form = {
                            recovery: ''
                        };

                        $scope.erro = '';

                        $ionicPopup.show({
                            scope   : $scope,
                            template: '<div class="popup-recovery"><form name="form.recovery" form-manager><label class="item item-input"><i class="icon ion-email placeholder-icon"></i><input type="email" ng-model="email" id="email" name="email" placeholder="{{ \'Digite seu email\' | translate }}" required ng-maxlength="80"></label><span class="error-msg">{{erro}}</span></form></div>',
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
                                        $scope.form.email = email;
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

                    });
                }
            }
        });
})();