(function () {
  'use strict';
  angular
    .module('app.direct')
    .config(configRoutes);

  var path = 'app/modules/photogram/modules/direct/';

  function configRoutes($stateProvider, $translatePartialLoaderProvider) {
    $stateProvider
    // Direct
      .state('photogram.direct', {
      url: '/direct',
      views: {
        tabHome: {
          controller: 'DirectHomeCtrl as vm',
          templateUrl: path + '/view/direct.home.html'
        }
      }
    })

    .state('photogram.message', {
      url: '/message/:channelId',
      views: {
        tabHome: {
          controller: 'DirectMessagesCtrl as vm',
          templateUrl: path + '/view/direct.messages.html'
        }
      }
    });

    // Translation
    $translatePartialLoaderProvider.addPart(path);
  }

})();
