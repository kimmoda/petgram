(function () {
  'use strict';
  angular
    .module('ionic')
    .constant('AppConfig', AppConfig());

  function AppConfig() {
    return {
      path: 'app/modules/photogram',
      app: {
        name: 'Photogram',
        url: 'http://photogramapp.com',
        image: 'http://photogramapp.com/social-share.jpg',
      },
      routes: {
        home: 'photogram.home',
        login: 'intro'
      },
      color: '#00796B',
      facebook: '1024016557617380',
      parse: {
        applicationId: '7lWT9DJntSvMKTetpoT0wL79pTG9dk4ob5pztktX',
        javascriptKey: 'UbrjB5Imc0btrAyoSb83HmCAHmFWc77JEB9AA1to'
      },
      locales: {
        pt: {
          'title': 'Portugês',
          'translation': 'TOOLBAR.PORTUGUES',
          'code': 'pt',
          'i18n': 'pt_BR',
          'flag': 'br'
        },
        en: {
          'title': 'English',
          'translation': 'TOOLBAR.ENGLISH',
          'code': 'en',
          'i18n': 'en_US',
          'flag': 'us'
        }
      },
      preferredLocale: 'en'
    };
  }
})();
