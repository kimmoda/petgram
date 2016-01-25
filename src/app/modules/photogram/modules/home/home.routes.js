(function () {
  'use strict';
  angular
    .module('app.home')
    .config(configRoutes);

  var path = 'app/modules/photogram/modules/home';

  function configRoutes($stateProvider) {
    $stateProvider
      .state('photogram.home', {
        url: '/home',
        views: {
          tabHome: {
            controller: 'PhotogramHomeCtrl as vm',
            templateUrl: path + '/view/home.html'
          }
        }
      });

  }

})();
