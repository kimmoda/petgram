(function () {
    'use strict';

    angular.module('starter').directive('facebookLogin', facebookLoginDirective);

    function facebookLoginDirective(Loading, $state, $q, $translate, AppConfig, Facebook, Dialog, User, $rootScope, Toast) {
        return {
            restrict: 'E',
            link    : facebookLoginLink,
            template: '<button class="button button-block button-facebook"><i class="icon ion-social-facebook"></i> <ion-spinner ng-if="loading"></ion-spinner> <span ng-if="!loading">{{ name || \'loginWithFacebook\'| translate}}</span> </button>',
        };

        function facebookLoginLink(scope, elem, attr) {

            scope.facebookStatus = null;
            Facebook.getCurrentUser().then(function (resp) {
                console.log(resp);
                scope.facebookStatus = resp;
                return resp;
            }).then(function (facebookStatus) {
                if (facebookStatus.status === 'connected') {
                    Facebook.me().then(function (userFacebook) {
                        scope.name = userFacebook.name;
                    });
                }
            }).catch(function () {
                console.log('Not logged');
            });

            elem.bind('click', facebookLogin);

            function facebookLogin() {
                console.log('Facebook login');
                scope.loading = true;

                Facebook.logIn().then(function (fbAuthData) {
                        console.log(fbAuthData);
                        if (fbAuthData.status === 'connected') {
                            var fbData = null;
                            return Facebook.me().then(function (data) {
                                fbData = data;
                                return User.findByEmail(data.email);
                            }).then(function (user) {
                                if (!user.id) {
                                    return User.signInViaFacebook(fbAuthData);
                                } else {
                                    if (user.get('authData').facebook.id === fbData.id) {
                                        return User.signInViaFacebook(fbAuthData);
                                    }
                                }
                            }).then(function () {
                                return User.updateWithFacebookData(fbData);
                            }).then(function (user) {
                                $rootScope.currentUser = user;
                                $state.go(AppConfig.routes.home, {
                                    clear: true
                                });
                                console.log(user, user.attributes);
                                $rootScope.$broadcast('onUserLogged');
                                Loading.end();
                                Toast.alert({text: $translate.instant('loggedInAsText') + ' ' + user.get('email')});
                            }, function (error) {
                                Dialog.alert(error);
                            });
                        }

                    }
                ).catch(function () {
                    Loading.end();
                });

            }

        }
    }

})();
