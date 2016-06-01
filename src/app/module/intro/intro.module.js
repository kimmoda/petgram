(function () {
  'use strict';
  angular
    .module('app.intro', [])
    .config(configRoutes);


  function configRoutes($stateProvider, $translatePartialLoaderProvider) {

    var path = 'app/module/intro';
    
    $stateProvider
      .state('intro', {
        url: '/intro',
        templateUrl: path + '/intro.html',
        controller: 'IntroCtrl',
        controllerAs: 'vm'
      });

    // Translation
    $translatePartialLoaderProvider.addPart(path);

  }
})();
