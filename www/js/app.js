'use strict';
angular
    .module ('starter', [
    'ionic',
    //'cacheapp',
    //'cachemodule',
    'formlyIonic',
    'angularMoment',
    'ionic.components',
    'ngFacebook',
    'angular-cache',
    'uiGmapgoogle-maps',
    'ngCordova',
    'gettext',
    'module.core',
    'module.user',
    'module.gallery',
    'module.feedback',
])
    .run (function ($ionicPlatform, $rootScope, AppConfig, gettextCatalog, amMoment, $cordovaStatusbar, GallerySetting, User) {

    User.init ();
    GallerySetting.init ();

    // Language
    $rootScope.langs = [
        {
            name : gettextCatalog.getString ('English'),
            value: 'en'
        },
        {
            name : gettextCatalog.getString ('Portuguese Brazil'),
            value: 'pt_BR'
        }
    ];

    $ionicPlatform.ready (function () {

        //$ionicAnalytics.register ();

        //inicializa o GOOGLE ANALYTICS para o app
        if (typeof analytics !== 'undefined') {
            analytics.startTrackerWithId ('UA-2111029-13');
        } else {
            console.log ('Google Analytics for Apps Unavailable');
        }


        if (window.cordova) {
            // org.apache.cordova.statusbar required
            $cordovaStatusbar.style (1);
            $cordovaStatusbar.styleHex (AppConfig.STATUSBAR);
            $cordovaStatusbar.overlaysWebView (true);

            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar (false);
            }
        }


        var LangVar     = navigator.language || navigator.userLanguage;
        var userLangVar = LangVar.substring (0, 2) + '_' + LangVar.substring (3, 5).toUpperCase ();
        $rootScope.lang = userLangVar;
        gettextCatalog.setCurrentLanguage (userLangVar);
        console.log (LangVar, userLangVar);
        amMoment.changeLocale (userLangVar);

    });

})
    .config (function ($ionicConfigProvider) {
    //$ionicConfigProvider.platform.ios.backButton.previousTitleText(' ').icon('ion-ios-arrow-left');
    //$ionicConfigProvider.platform.android.backButton.previousTitleText(' ').icon('ion-ios-arrow-left');
    //$ionicConfigProvider.views.swipeBackEnabled (true);
    $ionicConfigProvider.backButton.text (' ').icon ('ion-ios-arrow-left');
    //$ionicConfigProvider.backButton.previousTitleText (false).text ('Voltar').icon ('ion-ios-arrow-left');
    //$ionicConfigProvider.views.transition ('platform');
    //$ionicConfigProvider.navBar.alignTitle ('platform');
    //$ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.position ('bottom');
    $ionicConfigProvider.platform.android.tabs.style ('standard');

    // Android Native Scroll
    //var jsScrolling = (ionic.Platform.isAndroid () ) ? false : true;
    //$ionicConfigProvider.scrolling.jsScrolling (jsScrolling);
    $ionicConfigProvider.views.maxCache (1);
})

;
