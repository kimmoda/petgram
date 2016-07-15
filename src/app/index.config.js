(function () {
    'use strict';

    angular
        .module('starter')
        .run(startParse)
        .run(runIonic)
        .run(runFacebook)
        .config(configCompile)
        .config(configFacebook)
        .config(configIonic);

    function configCompile($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }

    function startParse(AppConfig, $localStorage, $location, $rootScope) {
        Parse.initialize(AppConfig.parse.appId);
        Parse.serverURL        = AppConfig.parse.server;
        $rootScope.currentUser = Parse.User.current();

        if (!$localStorage.unit) {
            $localStorage.unit = AppConfig.map.unit;
        }

        if (!$localStorage.mapType) {
            $localStorage.mapType = AppConfig.map.type;
        }

        console.log($rootScope.currentUser);
        if (!$rootScope.currentUser) {
            $location.path('/');
        }
    }

    function runIonic($ionicPlatform, $localStorage, $translate, $cordovaGlobalization, $cordovaSplashscreen, OneSignal, ConnectMonitor, AppConfig, User) {

        $ionicPlatform.ready(function () {

            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.disableScroll(true);
                window.StatusBar.styleLightContent();
            }

            // Remove back button android
            $ionicPlatform.registerBackButtonAction(function (event) {
                event.preventDefault();
            }, 100);

            if ($localStorage.lang) {
                $translate.use($localStorage.lang);
            } else {
                if (typeof navigator.globalization !== 'undefined') {
                    $cordovaGlobalization.getPreferredLanguage().then(function (language) {
                        $translate.use((language.value).split('-')[0]);
                    }, null);
                }
            }

            // Hide Splash Screen
            if (navigator && navigator.splashscreen) {
                $cordovaSplashscreen.hide();
            }

            // One Signal
            OneSignal
                .init(AppConfig.onesignal.id, AppConfig.onesignal.google)
                .then(function () {
                    OneSignal.getIds();
                });

            //ConnectMonitor.watch();
        });


    }

    function configIonic($ionicConfigProvider) {
        $ionicConfigProvider.platform.ios.backButton.previousTitleText(' ').icon('ion-ios-arrow-left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText(' ').icon('ion-ios-arrow-left');
        $ionicConfigProvider.views.swipeBackEnabled(false);
        $ionicConfigProvider.backButton.text(' ').icon('ion-ios-arrow-left');
        //$ionicConfigProvider.backButton.previousTitleText (false).text ('Voltar').icon ('ion-ios-arrow-left');
        //$ionicConfigProvider.views.transition ('platform');
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.navBar.alignTitle('center');
        $ionicConfigProvider.views.maxCache(1);
    }

    // Facebook
    function configFacebook($facebookProvider, AppConfig) {
        if (!window.cordova) {
            $facebookProvider.setAppId(AppConfig.facebookAppId);
            $facebookProvider.setPermissions('id,name,email,user_likes,bio');
        }
    }

    function runFacebook() {

        if (!window.cordova) {
            console.log('Facebook Browser');
            var LangVar     = window.navigator.language || window.navigator.userLanguage;
            var userLangVar = LangVar.substring(0, 2) + '_' + LangVar.substring(3, 5).toUpperCase();

            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js     = d.createElement(s);
                js.id  = id;
                js.src = 'http://connect.facebook.net/' + userLangVar + '/sdk.js';
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }

    }

})();
