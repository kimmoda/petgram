(function () {
  'use strict';
  angular
    .module('app.popular')
    .config(configRoutes);

  var path = 'app/modules/photogram/modules/popular';

  function configRoutes($stateProvider) {
    $stateProvider
      .state('photogram.popular', {
        url: '/popular',
        views: {
          tabPopular: {
            controller: 'PhotogramPopularCtrl as vm',
            templateUrl: path + '/view/photogram.popular.html'
          }
        }
      });

  }

})();
