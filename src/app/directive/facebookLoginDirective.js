(function () {
    'use strict';

    angular.module('starter').directive('facebookLogin', facebookLoginDirective);

    function facebookLoginDirective(Loading, $state, $translate, AppConfig, Facebook, Dialog, User, $rootScope) {
        return {
            restrict: 'E',
            link    : facebookLoginLink,
            template: '<button class="button button-block button-facebook"><i class="icon ion-social-facebook"></i> <ion-spinner ng-if="loading"></ion-spinner> <span ng-if="!loading">{{ me.name || \'loginWithFacebook\'| translate}}</span> </button>',
        };

        function facebookLoginLink(scope, elem, attr) {

            scope.facebookStatus = null;

            elem.bind('click', onLoginViaFacebook);


            function onLoginViaFacebook() {

                Facebook.getCurrentUser().then(function (response) {

                    if (response.status === 'connected') {
                        processFacebookLogin(response);
                    } else {
                        Facebook.logIn().then(function (authData) {
                            processFacebookLogin(authData);
                        });
                    }
                });
            }

            function processFacebookLogin(fbAuthData) {

                Loading.start('Conectando com o Facebook')
                var fbData, newUser;

                return Facebook.me().then(function (data) {
                    fbData = data;
                    return User.findByEmail(data.email);
                }).then(function (user) {
                    console.log(user);

                    if (!user.id) {
                        newUser = true;
                        return User.signInViaFacebook(fbAuthData);
                    }

                    var authData = user.get('authData');
                    console.log(authData.facebook.id, fbData.id);

                    if (authData) {
                        if (authData.facebook.id === fbData.id) {
                            return User.signInViaFacebook(fbAuthData);
                        }
                    } else {
                        var deferred = $q.defer();
                        deferred.reject('Facebook error');
                        return deferred.promise;
                    }
                }).then(function () {
                    return User.updateWithFacebookData(fbData);
                }).then(function (user) {
                    console.log(user, user.attributes);
                    $rootScope.currentUser = user;
                    $rootScope.$broadcast('onUserLogged');
                    Loading.end();
                    if (newUser) {
                        $state.go('user.avatar', {clear: true})
                    } else {
                        $state.go(AppConfig.routes.home, {clear: true});
                    }
                    Loading.end();
                }, function (error) {
                    console.info(error);
                    Loading.end();
                    Dialog.alert(error);
                })
            }

        }
    }

})();
