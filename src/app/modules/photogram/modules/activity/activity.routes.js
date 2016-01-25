(function () {
  'use strict';
  angular
    .module('app.activity')
    .config(configRoutes);

  var path = 'app/modules/photogram/modules/activity';

  function configRoutes($stateProvider) {
    $stateProvider
      .state('photogram.activity', {
        url: '/activity',
        views: {
          tabActivity: {
            controller: 'PhotogramActivityCtrl as vm',
            templateUrl: path + '/view/photogram.activity.html'
          }
        }
      })

    ;
  }

})();
