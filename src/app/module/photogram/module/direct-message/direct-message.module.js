(function () {
  'use strict';
  angular
      .module('app.direct-message', [])
      .config(configRoutes);

  var path = 'app/module/photogram/module/direct-message';

  function configRoutes($stateProvider) {


    $stateProvider
        .state('photogram.message', {
          url: '/message/:channelId',
          views: {
            tabHome: {
              controller: 'DirectMessageCtrl',
              controllerAs: 'vm',
              templateUrl: path + '/direct-message.html'
            }
          }
        });
  }

})();