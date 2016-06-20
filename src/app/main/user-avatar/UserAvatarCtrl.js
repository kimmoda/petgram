(function () {
    'use strict';
    /**
     * @ngdoc controller
     * @name UserAvatarCtrl
     *
     * @description
     * _Please update the description and dependencies._
     *
     * @requires $scope
     * */
    angular
        .module('app.main')
        .controller('UserAvatarCtrl', UserAvatarController);

    function UserAvatarController(User, Auth, AppConfig, $rootScope, $state, Toast, UserForm) {
        var vm          = this;
        vm.submitAvatar = submitAvatar;
        init();

        function init() {
            var user      = Auth.getLoggedUser();
            vm.form       = {
                name    : user.name,
                email   : user.email,
                status  : user.status,
                gender  : user.gender,
                img     : user.img,
                username: user.username
            };
            vm.formFields = UserForm.profile;
            console.log(vm.form);
            console.log(vm.formFields);
        }

        function submitAvatar() {
            console.log(vm.rForm);

            if (vm.rForm.$valid) {
                var dataForm = angular.copy(vm.form);
                console.log(dataForm);

                User.update(dataForm).then(function (resp) {
                    console.log(resp);
                    $rootScope.currentUser = Parse.User.current();
                    $state.go(AppConfig.routes.home, {
                        clear: true
                    });
                });
            } else {
                Toast.alert({
                    title: ('Invalid form'),
                    text : ('Fill out the fields in red')
                });
            }

        }

    }


})();
