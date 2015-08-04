'use strict';
angular
    .module ('module.user')
    .directive ('buttonFacebook', function (User, $state, Notify) {
    return {
        restrict: 'E',
        template: '<button class="button button-block button-facebook" ><i class="icon ion-social-facebook"></i> {{ \'Conectar com o Facebook\' | translate }} </button>',
        scope: {
          sref: '@'
        },
        link    : function ($scope, elem, attr) {

            elem.bind ('click', function () {

                User
                    .loginFacebook ()
                    .then (function (data) {
                    console.log (data);
                    $state.go ($scope.sref, {clear: true});
                }).catch (function (resp) {
                    console.log (resp);
                    Notify.alert ('Ops', resp.message);
                });
            });
        }
    }
});