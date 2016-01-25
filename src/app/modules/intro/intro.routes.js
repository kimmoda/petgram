(function () {
  'use strict';
  angular
    .module('app.intro')
    .config(configRoutes);

  var path = 'app/modules/intro';

  function configRoutes($stateProvider, $translatePartialLoaderProvider) {
    $stateProvider
      .state('intro', {
        url: '/intro',
        templateUrl: path + '/view/intro.html',
        controller: 'IntroCtrl as vm'
      });

    // Translation
    $translatePartialLoaderProvider.addPart(path);
  }

})();
