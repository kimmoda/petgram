(function () {
  'use strict';

  var cordova = window.cordova;

  angular
    .module('starter')
    .run(runIonic)
    .run(runLanguage)
    .run(runFacebook)
    .config(configFacebook)
    .config(configIonic);


  function runIonic($ionicPlatform, $cacheSrc, AppConfig, $cordovaStatusbar, $timeout,
    $cordovaSplashscreen, PhotogramSetting, User) {

    $cacheSrc.color = AppConfig.color;
    $cacheSrc.bgcolor = '#ddd';
    $cacheSrc.rounded = true;
    $cacheSrc.radius = 50;
    //$cacheSrc.interval = 5000;

    User.init();
    PhotogramSetting.init();

    $ionicPlatform.ready(function () {

      //$ionicAnalytics.register();

      if (cordova && cordova.plugins && cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      }

      if (cordova) {
        $timeout(function () {
          $cordovaSplashscreen.hide();
          $cordovaStatusbar.overlaysWebView(true);
          $cordovaStatusbar.style(1);
          $cordovaStatusbar.styleHex(AppConfig.color);
          $cordovaStatusbar.show();
        }, 500);
      }

    });


  }

  function runLanguage($rootScope, gettextCatalog, $translate, amMoment) {
    // Language
    $rootScope.langs = [{
      name: gettextCatalog.getString('English'),
      value: 'en_US'
    }, {
      name: gettextCatalog.getString('Portuguese Brazil'),
      value: 'pt_BR'
    }];

    var LangVar = navigator.language || navigator.userLanguage;
    var userLangVar = LangVar.substring(0, 2) + '_' + LangVar.substring(3, 5).toUpperCase();

    console.log(userLangVar);

    $rootScope.setLanguage = function (language) {

      $rootScope.lang = $rootScope.langs.filter(function (item) {
        return item.value === language;
      })[0];

      // Fix language
      if ($rootScope.lang === undefined) {
        $rootScope.lang = $rootScope.langs[0];
        language = $rootScope.lang.value;
      }

      gettextCatalog.setCurrentLanguage(language);
      $translate.use(language);
      amMoment.changeLocale(language);

    };

    $rootScope.setLanguage(userLangVar);
    console.info($rootScope.lang);
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

  function runFacebook() {
    var ionic = window.ionic;
    if (!(ionic.Platform.isIOS() || ionic.Platform.isAndroid())) {
      var LangVar = window.navigator.language || window.navigator.userLanguage;
      var userLangVar = LangVar.substring(0, 2) + '_' + LangVar.substring(3, 5).toUpperCase();
      var document = window.document;
      // If we've already installed the SDK, we're done
      if (document.getElementById('facebook-jssdk')) return;

      // Get the first script element, which we'll use to find the parent node
      var firstScriptElement = document.getElementsByTagName('script')[0];

      // Create a new script element and set its id
      var facebookJS = document.createElement('script');
      facebookJS.id = 'facebook-jssdk';

      // Set the new script's source to the source of the Facebook JS SDK
      facebookJS.src = 'http://connect.facebook.net/' + userLangVar + '/all.js';

      // Insert the Facebook JS SDK into the DOM
      firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
    }
  }

  function configFacebook($facebookProvider, AppConfig) {
    $facebookProvider.setAppId(AppConfig.facebook);
    $facebookProvider.setPermissions('id,name,email,user_likes,bio');
  }


})();
