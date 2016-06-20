(function () {
    'use strict';
    angular
        .module('app.main')
        .controller('UserRegisterCtrl', UserRegisterController);

    function UserRegisterController($state, UserForm, $rootScope, Toast, Loading, User) {
        var vm            = this;
        vm.formFields     = UserForm.register;
        vm.submitRegister = submitRegister;

        init();

        function init() {
            vm.form = {
                email   : '',
                password: ''
            };
        }

        function submitRegister(rForm, data) {

            if (rForm.$valid) {
                Loading.start();
                var form = angular.copy(data);
                User.signUp(form).then(function (resp) {
                    console.log(resp);

                    // After register, login
                    User.signIn({
                        email   : form.email,
                        password: form.password
                    }).then(function (data) {
                        console.log(data);
                        $rootScope.currentUser = Parse.User.current();
                        Loading.end();
                        $state.go('user.avatar', {
                            clear: true
                        });
                    }).catch(function (resp) {
                        console.log(resp);
                        Loading.end();
                        Toast.alert({
                            title: 'Ops',
                            text : resp.message
                        });
                    });
                })
                    .catch(function (resp) {
                        console.log(resp);
                        Loading.end();
                        Toast.alert({
                            title: 'Ops',
                            text : resp.message
                        });
                    });
            }
        }
    }


})();
