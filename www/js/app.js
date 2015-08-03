'use strict';
angular
    .module ('starter', [
    'ionic',
    //'cacheviews'
    'formlyIonic',
    'ionic.components',
    'monospaced.elastic',
    'ngFacebook',
    'angular-cache',
    'uiGmapgoogle-maps',
    'ngCordova',
    'gettext',
    'module.core',
    'module.gallery',
    'module.user',
    'module.miscellaneous',
    'module.facebook',
    'module.card',
    'module.feedback',
])
    .run (function ($ionicPlatform, $rootScope, AppConfig, $cordovaStatusbar, ParseService, User) {

    //ParseService
    //    .start ()
    //    .then (function (resp) {
    //    console.log (resp);
    //});

    User.init ();
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
            $cordovaStatusbar.styleHex(AppConfig.STATUSBAR);
            $cordovaStatusbar.overlaysWebView(true);

            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar (false);
            }

            if (window.device.platform == 'iOS') {
                navigator.splashscreen.hide ();
            }
        }

    });

})
    .config (function ($ionicConfigProvider) {
    //     $ionicConfigProvider.platform.ios.backButton.previousTitleText(' ').icon('ion-ios-arrow-left');
    //     $ionicConfigProvider.platform.android.backButton.previousTitleText(' ').icon('ion-ios-arrow-left');
    // $ionicConfigProvider.views.swipeBackEnabled (true);
    $ionicConfigProvider.backButton.text ('Voltar').icon ('ion-ios-arrow-left');
    $ionicConfigProvider.backButton.previousTitleText (false).text ('Voltar').icon ('ion-ios-arrow-left');
    $ionicConfigProvider.views.transition ('platform');
    $ionicConfigProvider.navBar.alignTitle ('platform');
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.tabs.style('standard');
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
