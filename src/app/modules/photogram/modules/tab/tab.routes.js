(function () {
  'use strict';
  angular
    .module('app.tab')
    .config(configRoutes);

  var path = 'app/modules/photogram/modules/tab';

  function configRoutes($stateProvider) {
    $stateProvider
      .state('photogram', {
        url: '/photogram',
        abstract: true,
        templateUrl: path + '/view/photogram.tabs.html',
        controller: 'PhotogramTabsCtrl as vm'
      });


  }

})();
