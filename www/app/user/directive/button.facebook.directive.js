'use strict';
angular
    .module ('module.user')
    .directive ('buttonFacebook', function (User, $state, gettextCatalog, Notify) {
    return {
        restrict: 'E',
        template: '<button class="button button-block button-facebook" ><i class="icon ion-social-facebook"></i> {{ msg }} </button>',
        scope   : {
            login   : '@',
            register: '@',
        },
        link    : function ($scope, elem, attr) {
            $scope.msg = gettextCatalog.getString ('Conect your Facebook')
            elem.bind ('click', function () {

                User
                    .loginFacebook ()
                    .then (function (data) {
                    console.log (data);
                    $state.go ($scope.login, {clear: true});
                }).catch (function (resp) {
                    console.log (resp);
                    Notify.alert ('Ops', resp.message);
                });
            });
        }
    }
});