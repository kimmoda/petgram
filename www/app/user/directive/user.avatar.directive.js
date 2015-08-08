'use strict';
angular
    .module ('module.user')
    .directive ('userAvatar', function ($ionicModal, PhotoService, User, UserForm, $state) {
    return {
        restrict: 'A',
        scope   : {
            gallery: '@'
        },
        template: '',
        link    : function ($scope, elem, attr) {

            elem.bind ('click', function () {

                PhotoService
                    .open ()
                    .then (function (resp) {
                    $scope.form.photo = resp;
                    User
                        .updateAvatar ($scope.form)
                        .then (function (resp) {
                        console.log (resp);
                    });
                })
                    .catch (function (resp) {
                    console.log (resp);
                });
            });

        }
    }
});