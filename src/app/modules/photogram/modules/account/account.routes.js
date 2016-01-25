(function () {
  'use strict';
  angular
    .module('app.account')
    .config(configRoutes);

  var path = 'app/modules/photogram/modules/account';

  function configRoutes($stateProvider) {
    $stateProvider
      .state('userlist', {
        url: '/follow',
        controller: 'PhotogramUserListCtrl as vm',
        templateUrl: 'app/modules/user/modules/friend/view/user.list.html'
      })

    .state('photogram.account', {
      url: '/account',
      views: {
        tabProfile: {
          controller: 'PhotogramProfileCtrl as vm',
          templateUrl: 'app/modules/user/modules/profile/view/profile.html'
        }
      }
    });
  }

})();
