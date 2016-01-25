(function () {
  'use strict';
  var path = 'app/modules/user';

  angular
    .module('app.user')
    .config(addRoute);

  function addRoute($stateProvider, $urlRouterProvider, $translatePartialLoaderProvider) {
    $translatePartialLoaderProvider.addPart(path);

    $stateProvider


      .state('user', {
      url: '/user',
      abstract: true,
      templateUrl: path + '/tabs/user.tabs.html'
    })

    .state('user.signin', {
      url: '/signin',
      views: {
        tabLogin: {
          controller: 'UserSigninCtrl as vm',
          templateUrl: path + '/modules/signin/view/user.signin.html'
        }
      }
    })

    .state('user.signup', {
      url: '/signup',
      views: {
        tabLogin: {
          controller: 'UserSignupCtrl as vm',
          templateUrl: path + '/modules/signup/view/user.signup.html'
        }
      }
    })

    .state('useravatar', {
      url: '/avatar',
      controller: 'UserAvatarCtrl as vm',
      templateUrl: path + '/modules/avatar/view/user.avatar.html'
    })


    .state('usermerge', {
      url: '/merge',
      controller: 'UserMergeCtrl as vm',
      templateUrl: path + '/modules/merge/view/user.merge.html'
    })

    .state('logout', {
      url: '/logout',
      template: '<ion-view view-title="Logout" cache-view="false"><ion-content></ion-content></ion-view>',
      controller: 'LogoutCtrl as vm'
    });

    $urlRouterProvider.otherwise('/');

  }

})();
