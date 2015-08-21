(function(){
    'use strict';
    angular
        .module('module.user')
        .directive('buttonFacebook', function (User, $state, gettextCatalog, $cordovaFacebook, $window, $rootScope, Notify) {
            return {
                restrict: 'E',
                template: '<button class="button button-block button-facebook" ><i class="icon ion-social-facebook"></i> {{ msg }} </button>',
                scope   : {
                    login   : '@',
                    register: '@',
                },
                link    : function ($scope, elem, attr) {
                    $scope.msg = gettextCatalog.getString('Conect your Facebook')

                    function login(user) {
                        if (!user.existed()) {
                            console.warn('User signed up and logged in through Facebook!', user);
                            $window
                                .FB
                                .api('/me', function (response) {
                                    if (user.attributes.idFacebook === '') {
                                        user.set('name', response.name);
                                        user.set('email', response.email);
                                        user.set('facebookimg', 'https://graph.facebook.com/' + response.id + '/picture?width=250&height=250');
                                        user.set('idFacebook', response.id)
                                        user.save();
                                    }
                                    console.log('/me response', response);

                                    $rootScope.user     = user.attributes;
                                    $rootScope.user.img = user.attributes.facebookimg;

                                    $state.go($scope.login, {clear: true});
                                });

                        } else {

                            console.info('User logged in through Facebook!', user);

                            $rootScope.user     = user.attributes;
                            $rootScope.user.img = user.attributes.facebookimg;
                            $state.go($scope.login, {clear: true});
                        }
                    }

                    elem.bind('click', function () {

                        //Browser Login
                        if (!($window.ionic.Platform.isIOS() || $window.ionic.Platform.isAndroid())) {

                            $window
                                .Parse
                                .FacebookUtils
                                .logIn(null, {
                                    success: function (user) {
                                        console.log(user);
                                        login(user);
                                    },
                                    error  : function (user, error) {
                                        console.error('User cancelled the Facebook login or did not fully authorize.');
                                    }
                                });

                        }
                        //Native Login
                        else {

                            $cordovaFacebook
                                .login([
                                    'public_profile',
                                    'email'
                                ])
                                .then(function (success) {

                                    console.log(success);

                                    //Need to convert expiresIn format from FB to date
                                    var expiration_date = new Date();
                                    expiration_date.setSeconds(expiration_date.getSeconds() + success.authResponse.expiresIn);
                                    expiration_date     = expiration_date.toISOString();

                                    var facebookAuthData = {
                                        "id"             : success.authResponse.userID,
                                        "access_token"   : success.authResponse.accessToken,
                                        "expiration_date": expiration_date
                                    };

                                    $window
                                        .Parse
                                        .FacebookUtils
                                        .logIn(facebookAuthData, {
                                            success: function (user) {
                                                console.log(user);
                                                login(user);
                                            },
                                            error  : function (user, error) {
                                                alert("User cancelled the Facebook login or did not fully authorize.");
                                            }
                                        });

                                }, function (error) {
                                    console.log(error);
                                });

                        }
                    });
                }
            }
        });
})();