(function () {
    'use strict';

    var cordova = window.cordova;
    angular
        .module('starter')
        .run(startParse)
        .run(runIonic)
        .run(runFacebook)
        .config(configCompile)
        .config(configLanguage)
        .config(configFacebook)
        .config(configIonic);


    function configCompile ($compileProvider) {
      $compileProvider.debugInfoEnabled(false);
    }

    function startParse(AppConfig) {
        window.Parse.initialize(AppConfig.parse.appId);
        window.Parse.serverURL = AppConfig.parse.server;
    }

    function runIonic($ionicPlatform, $cacheSrc, AppConfig, $cordovaStatusbar, $timeout,
                      $cordovaSplashscreen, PhotogramSetting, User) {

        $cacheSrc.color   = AppConfig.color;
        $cacheSrc.bgcolor = '#ddd';
        $cacheSrc.rounded = true;
        $cacheSrc.radius  = 50;
        //$cacheSrc.interval = 5000;

        User.init();
        PhotogramSetting.init();

        $ionicPlatform.ready(function () {

            if (cordova) {
                $timeout(function () {
                    $cordovaSplashscreen.hide();
                    $cordovaStatusbar.overlaysWebView(true);
                    $cordovaStatusbar.style(0);
                    $cordovaStatusbar.styleHex(AppConfig.color);
                    $cordovaStatusbar.show();
                }, 500);
            }

        });


    }

    function configLanguage($translateProvider, AppConfig, tmhDynamicLocaleProvider) {

        // angular-translate configuration
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '{part}/i18n/{lang}.json'
        });
        $translateProvider.useSanitizeValueStrategy(null);

        // Translate Config
        $translateProvider.useMissingTranslationHandlerLog();
        $translateProvider.useLocalStorage(); // saves selected language to localStorage
        tmhDynamicLocaleProvider.localeLocationPattern('../bower_components/angular-i18n/angular-locale_{{locale}}.js');

        var langvar     = navigator.language || navigator.userlanguage;
        var userlangvar = langvar.split('-')[0];
        var language    = AppConfig.preferredLocale;
        var searchLang  = _.some(AppConfig.locales, {
            code: userlangvar
        });
        if (searchLang) {
            language = _.filter(AppConfig.locales,{code: searchLang})[0];
        }
        console.log(language);
        $translateProvider.preferredLanguage(language);
        moment.locale(language);

        console.log(searchLang, language);
    }

    function configIonic($ionicConfigProvider) {
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
        $ionicConfigProvider.views.maxCache(1);
    }

    // Facebook
    function configFacebook($facebookProvider, AppConfig) {
        $facebookProvider.setAppId(AppConfig.facebook);
        $facebookProvider.setPermissions('id,name,email,user_likes,bio');
    }

    function runFacebook() {
        var ionic = window.ionic;
        if (!(ionic.Platform.isIOS() || ionic.Platform.isAndroid())) {
            var LangVar     = window.navigator.language || window.navigator.userLanguage;
            var userLangVar = LangVar.substring(0, 2) + '_' + LangVar.substring(3, 5).toUpperCase();

            // Load the SDK asynchronously
            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js     = d.createElement(s);
                js.id  = id;
                js.src = "//connect.facebook.net/" + userLangVar + "/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }
    }

})();
