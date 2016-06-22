(function () {
    'use strict';

    angular
        .module('starter')
        .directive('facebookLogin', facebookLoginDirective);

    function facebookLoginDirective(Loading, $state, $q, $translate, Facebook, Dialog, User, $rootScope, Toast) {
        return {
            restrict: 'E',
            link    : facebookLoginLink,
            template: '<button class="button button-block button-facebook"><i class="icon ion-social-facebook"></i> <span>{{ name || \'loginWithFacebook\'| translate}}</span> </button>',
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
                Loading.start();

                Facebook.getCurrentUser().then(function (fbAuthData) {
                    console.log(fbAuthData);

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
                                console.log(user);
                                console.log(user.attributes);
                                // merge
                                $rootScope.tempUser = user;
                                $state.go('user.merge', {
                                    clear: true
                                });
                                Loading.end();
                                //var deferred = $q.defer();
                                //deferred.reject($translate.instant('emailFacebookTakenText'));
                                //return deferred.promise;
                            }
                        });
                        //           .then(function () {
                        //               return User.updateWithFacebookData(fbData);
                        //           }).then(function (user) {
                        //    Toast.show($translate.instant('loggedInAsText') + ' ' + user.get('email'));
                        //}, function (error) {
                        //    Dialog.alert(error);
                        //});

                    }

                    switch (fbAuthData.status) {
                        case 'connected':
                            // logado
                            processFacebookLogin();
                            //Loading.end();
                            //$state.go(AppConfig.routes.home, {
                            //    clear: true
                            //});
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
                }).catch(function () {
                    Loading.end();
                });

                function processFacebookLogin(fbAuthData) {

                    Loading.start();

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
                            var deferred = $q.defer();
                            deferred.reject($translate.instant('emailFacebookTakenText'));
                            return deferred.promise;
                        }
                    }).then(function () {
                        return User.updateWithFacebookData(fbData);
                    }).then(function (user) {
                        Toast.show($translate.instant('loggedInAsText') + ' ' + user.get('email'));
                    }, function (error) {
                        Dialog.alert(error);
                    });
                }

            }

        }
    }

})();
