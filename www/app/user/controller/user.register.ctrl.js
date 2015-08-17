(function () {
    'use strict';
    angular
        .module('module.user')
        .controller('RegisterCtrl', function ($state, UserForm, $filter, Notify, User) {
            var vm = this;

            function init() {
                vm.form = {};
            }

            init();

            vm.formFields = UserForm.register;

            vm.submitRegister = function (rForm, data) {

                if (rForm.$valid) {
                    var form = angular.copy(data);
                    User
                        .register(form)
                        .then(function (resp) {
                            console.log(resp);
                            $state.go('userlist');
                            init();
                        })
                        .catch(function (resp) {
                            console.log(resp);
                            Notify.alert({
                                title: 'Ops',
                                text : resp
                            });
                        });
                }
            };
        });
})();