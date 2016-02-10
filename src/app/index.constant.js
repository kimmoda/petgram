(function () {
  'use strict';
  angular
    .module('ionic')
    .constant('AppConfig', AppConfig());

  function AppConfig() {
    return {
      path: 'app/photogram',
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
        applicationId: 'FHLkaJHZ3FHyDfbj7PKB415nZQz8xK9dWCpRzJZv',
        javascriptKey: 'OElFDBigKrSktmwnXfjabvsCoBUa1ypHC9T07QB0'
      }
    };
  }
})();
