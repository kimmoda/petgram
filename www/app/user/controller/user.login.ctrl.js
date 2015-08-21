(function(){
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

        });
})();