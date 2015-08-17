(function () {
    'use strict';
    angular
        .module('starter', [
            'ionic',
            //'cacheapp',
            //'cachemodule',
            'formlyIonic',
            'pascalprecht.translate',
            'angularMoment',
            'ionic.components',
            'ngFacebook',
            'translate.app',
            'translate.form',
            'angular-cache',
            'uiGmapgoogle-maps',
            'ngCordova',
            'gettext',
            'module.core',
            'module.user',
            'module.gallery'
        ])
        .run(function ($ionicPlatform, $rootScope, $window, $cordovaStatusbar, $timeout, $cordovaSplashscreen, ConnectMonitor, GallerySetting, User) {

            User.init();
            GallerySetting.init();
            ConnectMonitor.startWatching();


            if ($window.cordova) {
                // org.apache.cordova.statusbar required
                $cordovaStatusbar.style(1);
                $cordovaStatusbar.styleHex('#00796B');
                $cordovaStatusbar.overlaysWebView(true);

                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                }
            }

            $ionicPlatform.ready(function () {

                //inicializa o GOOGLE ANALYTICS para o app
                if (typeof analytics !== 'undefined') {
                    analytics.startTrackerWithId('UA-2111029-13');
                } else {
                    console.log('Google Analytics for Apps Unavailable');
                }

                if ($window.cordova) {
                    $timeout(function () {
                        $cordovaSplashscreen.hide();
                    }, 100);
                }

            });


        })
        .run(function ($rootScope, gettextCatalog, $translate, amMoment) {
            // Language
            $rootScope.langs = [
                {
                    name : gettextCatalog.getString('English'),
                    value: 'en'
                },
                {
                    name : gettextCatalog.getString('Portuguese Brazil'),
                    value: 'pt_BR'
                }
            ];

            var LangVar     = navigator.language || navigator.userLanguage;
            var userLangVar = LangVar.substring(0, 2) + '_' + LangVar.substring(3, 5).toUpperCase();

            $rootScope.setLanguage = function (language) {

                $rootScope.lang = $rootScope.langs.filter(function (item) {
                    return item.value == language;
                })[0];

                gettextCatalog.setCurrentLanguage(language);
                $translate.use(language);
                amMoment.changeLocale(language);
                console.log(language);
                console.log($rootScope.lang);
            };

            $rootScope.setLanguage(userLangVar);
            console.log(LangVar, userLangVar);
        })
        .config(function ($ionicConfigProvider) {
            //$ionicConfigProvider.platform.ios.backButton.previousTitleText(' ').icon('ion-ios-arrow-left');
            //$ionicConfigProvider.platform.android.backButton.previousTitleText(' ').icon('ion-ios-arrow-left');
            //$ionicConfigProvider.views.swipeBackEnabled (true);
            $ionicConfigProvider.backButton.text(' ').icon('ion-ios-arrow-left');
            //$ionicConfigProvider.backButton.previousTitleText (false).text ('Voltar').icon ('ion-ios-arrow-left');
            //$ionicConfigProvider.views.transition ('platform');
            //$ionicConfigProvider.navBar.alignTitle ('platform');
            //$ionicConfigProvider.tabs.position('bottom');
            $ionicConfigProvider.platform.android.tabs.position('bottom');
            $ionicConfigProvider.platform.android.tabs.style('standard');

            // Android Native Scroll
            //var jsScrolling = (ionic.Platform.isAndroid () ) ? false : true;
            //$ionicConfigProvider.scrolling.jsScrolling (jsScrolling);
            $ionicConfigProvider.views.maxCache(1);
        })

    ;

})();