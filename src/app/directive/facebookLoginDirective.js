(function () {
    'use strict';

    angular.module('starter').directive('facebookLogin', facebookLoginDirective);

    function facebookLoginDirective(Loading, $q, $ionicPlatform, $state, $translate, AppConfig, Facebook, Dialog, User, $rootScope, Toast) {
        return {
            restrict: 'E',
            link    : facebookLoginLink,
            template: '<button class="button button-block button-facebook"><i class="icon ion-social-facebook"></i> <ion-spinner ng-if="loading"></ion-spinner> <span ng-if="!loading">{{ me.name || \'loginWithFacebook\'| translate}}</span> </button>',
        };

        function facebookLoginLink(scope, elem, attr) {

            scope.facebookStatus = null;

            elem.bind('click', facebookLogin);

            function facebookLogin() {
                console.log('Facebook login');

                scope.loading = true;

                Facebook.logIn().then(function (fbAuthData) {
                    console.log(fbAuthData);
                    Loading.start();
                    if (fbAuthData.status === 'connected') {
                        var fbData = null;
                        return Facebook.me().then(function (data) {
                            fbData = data;
                            return User.findByEmail(data.email);
                        }).then(function (user) {
                            if (!user.id) {
                                return User.signInViaFacebook(fbAuthData);
                            } else if (user.get('authData')) {
                                if (user.get('authData').facebook.id === fbData.id) {
                                    return User.signInViaFacebook(fbAuthData);
                                }
                            } else {
                                $rootScope.tempUser = user;
                                $state.go('user.merge', {clear: true});
                            }
                        }).then(function () {
                            return User.updateWithFacebookData(fbData);
                        }).then(function (user) {
                            if (user) {
                                $rootScope.currentUser = Parse.User.current();
                                $state.go('user.avatar', {
                                    clear: true
                                });
                                console.log(user, user.attributes);
                                $rootScope.$broadcast('onUserLogged');
                                Loading.end();
                                Toast.alert({text: $translate.instant('loggedInAsText') + ' ' + user.get('email')});
                            } else {
                                console.log('Error ');
                            }
                        }, function (error) {
                            Dialog.alert(error);
                            Loading.end();
                            scope.loading = false;
                        });
                    }

                }).catch(function (err) {
                    console.log('err', err);
                    Loading.end();
                    scope.loading = false;
                });

            }

        }
    }

})();
