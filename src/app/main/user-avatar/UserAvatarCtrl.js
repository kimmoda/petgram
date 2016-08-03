(function () {
    'use strict';

    angular.module('app.main').controller('UserAvatarCtrl', UserAvatarController);

    function UserAvatarController(User, $translate, $scope, Auth, AppConfig, $rootScope, $state, Toast) {

        init();

        $scope.photo = Parse.User.current().attributes.photo;

        function init() {
            var user    = Auth.getLoggedUser();
            $scope.form = {
                name    : user.name,
                email   : user.email,
                status  : user.status,
                gender  : user.gender,
                img     : user.img,
                username: user.username
            };
            console.log($scope.form);
            console.log($scope.formFields);
        }

        $scope.submitAvatar = function (rForm, form) {
            console.log(form);

            if (rForm.$valid) {
                var dataForm = angular.copy(form);
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
                    title: $translate.instant('invalidForm'),
                    text : $translate.instant('fillAllFields')
                });
            }

        }

    }


})();
