'use strict';
angular
    .module ('starter', [
    'ionic',
    //'cacheviews'
    'ngAnimate',
    'formlyIonic',
    'ionic.components',
    'monospaced.elastic',
    'ngFacebook',
    'angular-cache',
    'uiGmapgoogle-maps',
    'angulartics',
    'angulartics.google.analytics',
    'angulartics.google.analytics.cordova',
    'ngCordova',
    'gettext',
    'module.core',
    'module.player',
    'module.gallery',
    'module.user',
    'module.miscellaneous',
    'module.stube',
    'module.fitness',
    'module.blog',
    'module.todo',
    'module.chat',
    'module.facebook',
    'module.futebol',
    'module.contact',
    'module.alimento',
    'module.card',
    'module.feedback',
    'module.place'
])
    .run (function ($ionicPlatform, $rootScope, $cordovaStatusbar, User) {
    User.init ();

    $ionicPlatform.ready (function () {

        //inicializa o GOOGLE ANALYTICS para o app
        if (typeof analytics !== 'undefined') {
            analytics.startTrackerWithId ('UA-2111029-13');
        } else {
            console.log ('Google Analytics for Apps Unavailable');
        }


        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            //StatusBar.styleDefault ();
            // styles: Default : 0, LightContent: 1, BlackTranslucent: 2, BlackOpaque: 3
            $cordovaStatusbar.style (1);

            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar (false);
            }

            if (window.StatusBar) {
                StatusBar.styleLightContent ();
                StatusBar.overlaysWebView (true);
            }
            if (window.device.platform == 'iOS') {
                navigator.splashscreen.hide ();
            }
            if (window.cordova.platformId == 'android') {
                StatusBar.backgroundColorByHexString ("#641A70");
            }
        }

    });

})
    .config (function ($ionicConfigProvider) {
    //     $ionicConfigProvider.platform.ios.backButton.previousTitleText(' ').icon('ion-ios-arrow-left');
    //     $ionicConfigProvider.platform.android.backButton.previousTitleText(' ').icon('ion-ios-arrow-left');
    $ionicConfigProvider.views.swipeBackEnabled (false);
    $ionicConfigProvider.backButton.text (' ').icon ('ion-ios-arrow-left');
    $ionicConfigProvider.backButton.previousTitleText (false).text (' ').icon ('ion-ios-arrow-left');
    $ionicConfigProvider.views.transition ('platform');
    $ionicConfigProvider.navBar.alignTitle ('platform');
    $ionicConfigProvider.views.maxCache (1);

})
    .run (function ($rootScope, gettextCatalog) {
    // Language
    $rootScope.langs = {
        'pt_BR': gettextCatalog.getString ('Portuguese Brazil'),
        'us'   : gettextCatalog.getString ('English')
    };

    var LangVar     = navigator.language || navigator.userLanguage;
    var userLangVar = LangVar.substring (0, 2) + '_' + LangVar.substring (3, 5).toUpperCase ();
    $rootScope.lang = userLangVar;
    gettextCatalog.setCurrentLanguage (userLangVar);
})
;
