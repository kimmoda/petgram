(function () {
  'use strict';
  angular
    .module('ionic')
    .constant('AppConfig', AppConfig());

  function AppConfig() {
    return {
      path: 'app/module/photogram',
      app: {
        name: 'GoCapture',
        url: 'http://gocaptureapp.com',
        image: 'http://gocaptureapp.com/social-share.jpg',
      },
      routes: {
        home: 'photogram.home',
        login: 'intro'
      },
      color: '#0097a7',
      facebook: '196860533985722',
      parse: {
<<<<<<< HEAD
        applicationId: 'FHLkaJHZ3FHyDfbj7PKB415nZQz8xK9dWCpRzJZv',
        javascriptKey: 'OElFDBigKrSktmwnXfjabvsCoBUa1ypHC9T07QB0'
      }
=======
        applicationId: '7lWT9DJntSvMKTetpoT0wL79pTG9dk4ob5pztktX',
        javascriptKey: 'UbrjB5Imc0btrAyoSb83HmCAHmFWc77JEB9AA1to'
      },
      locales: {
        pt: {
          'translation': 'LANG.PORTUGUES',
          'code': 'pt'
        },
        en: {
          'translation': 'LANG.ENGLISH',
          'code': 'en'
        },
        tr: {
          'translation': 'LANG.TURKISH',
          'code': 'tr'
        },
        fa: {
          'translation': 'LANG.PERSIAN',
          'code': 'fa'
        },
        de: {
          'translation': 'LANG.GERMAN',
          'code': 'de'
        }
      },
      preferredLocale: 'en'
>>>>>>> origin/master
    };
  }
})();
