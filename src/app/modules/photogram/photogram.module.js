(function () {
  'use strict';
  var path = 'app/modules/photogram';

  angular
    .module('app.photogram', [
      'ionic',
      'ngCordova',
      'app.tab',
      'app.account',
      'app.activity',
      'app.direct',
      'app.feedback',
      'app.home',
      'app.popular',
      'app.search'
    ])
    .config(function ($translatePartialLoaderProvider) {
      // Translation
      $translatePartialLoaderProvider.addPart(path);
    });
})();
