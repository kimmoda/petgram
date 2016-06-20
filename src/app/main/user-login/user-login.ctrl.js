(function () {
    'use strict';
    angular.module('app.main').controller('UserLoginCtrl', UserLoginController);

    function UserLoginController(AppConfig, UserForm, $rootScope, Auth, Loading, $state, Toast, User) {
        var vm         = this;
        vm.formFields  = UserForm.login;
        vm.routeLogged = AppConfig.routes.home;
        vm.submitLogin = submitLogin;
        vm.facebook    = facebook;

        init();

        function init() {
            vm.form = {
                username: '',
                password: ''
            };
        }

        function submitLogin(rForm, data) {

            var form = angular.copy(data);
            if (rForm.$valid) {
                Loading.start();

                console.log(form);
                Auth.logIn(form).then(function (data) {
                    console.log(data, data.attributes);
                    $rootScope.currentUser = data;
                    console.log(Auth.getLoggedUser().name);
                    if (Auth.getLoggedUser()) {
                        $state.go(vm.routeLogged, {
                            clear: true
                        });
                    } else {
                        $state.go('useravatar', {
                            clear: true
                        });
                    }
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
        }

        function facebook() {
            Loading.start();
            User
                .facebookLogin()
                .then(function (resp) {
                    console.log(resp);

                    Loading.end();
                    switch (resp.status) {
                        case 0:
                            // logado
                            $state.go(AppConfig.routes.home, {
                                clear: true
                            });
                            break;
                        case 1:
                            // novo user
                            $state.go('useravatar', {
                                clear: true
                            });
                            break;
                        case 2:
                            // merge
                            $state.go('usermerge', {
                                clear: true
                            });
                            break;
                    }
                })
                .catch(function () {
                    Loading.end();
                    Toast.alert({
                        title: 'Ops',
                        text : ('Facebook error')
                    });
                });
        }

    }


})();
