(function (window, angular, undefined) {
  'use strict';
  angular
    .module('ionic')
    .constant('AppConfig', AppConfig());

  function AppConfig() {
    return {
      path: 'js/photogram',
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
        applicationId: 'UvhuXeVcCTJ0yTeHwVDgCV0n7R0NVzc1wXW9VNcz',
        clientKey: 'shfQZO4NjY0nZYEa76HdkDqVmHxwBVdNmWXyF8w0',
        javascriptKey: 'Qm8aQHKH2W2cm81yGbi18uqrC2DJNMJdM3TcOFIX'
      }
    };
  }
})(window, window.angular);
