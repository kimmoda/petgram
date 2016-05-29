(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name facebookLogin
     *
     * @description
     * _Please update the description and restriction._
     *
     * @restrict A
     * */

    angular
        .module('app.photogram')
        .directive('facebookLogin', facebookLoginDirective);

    function facebookLoginDirective(Loading, User, $state, $cordovaFacebook, $facebook, AppConfig, Notify) {
        return {
            restrict: 'E',
            link: facebookLoginLink,
            template: '<button class="button button-block button-facebook"><i class="icon ion-social-facebook"></i> <span>{{ \'USER.BUTTON.LOGIN_SOCIAL\'| translate}} {{name || \'Facebook\'}}</span> </button>',
        };

        function facebookLoginLink(scope, elem, attr) {

            var facebook = window.cordova ? $cordovaFacebook : $facebook;

            console.log('Facebook login', facebook);
            
            facebook
                .getLoginStatus()
                .then(function (resp) {
                    console.log(resp);
                    facebook
                        .api('/me')
                        .then(function (profile) {
                            console.log(profile);
                            scope.name = profile.name;
                        });
                })
                .catch(function (resp) {
                    console.log('Not logged');
                });

            elem.bind('click', facebookLogin);

            function facebookLogin() {
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
                                $state.go('user.avatar', {
                                    clear: true
                                });
                                break;
                            case 2:
                                // merge
                                $state.go('user.merge', {
                                    clear: true
                                });
                                break;
                        }
                    })
                    .catch(function () {
                        Loading.end();
                        Notify.alert({
                            title: 'Ops',
                            text: ('Facebook error')
                        });
                    });
            }

        }
    }

})();