(function (window, angular, undefined) {
  'use strict';
  angular
    .module('app.user')
    .config(addRoute);

  function addRoute($stateProvider, $urlRouterProvider) {

    var path = 'js/user';

    $stateProvider

      .state('router', {
      url: '/',
      templateUrl: path + '/loading/loading.html',
      controller: 'LoadingCtrl as vm'
    })


    .state('intro', {
      url: '/intro',
      templateUrl: path + '/intro/intro.html',
      controller: 'IntroCtrl as vm'
    })

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
          templateUrl: path + '/signin/user.signin.html'
        }
      }
    })

    .state('user.signup', {
      url: '/signup',
      views: {
        tabLogin: {
          controller: 'UserSignupCtrl as vm',
          templateUrl: path + '/signup/user.signup.html'
        }
      }
    })

    .state('useravatar', {
      url: '/avatar',
      controller: 'UserAvatarCtrl as vm',
      templateUrl: path + '/avatar/user.avatar.html'
    })


    .state('usermerge', {
      url: '/merge',
      controller: 'UserMergeCtrl as vm',
      templateUrl: path + '/merge/user.merge.html'
    })

    .state('logout', {
      url: '/logout',
      templateUrl: path + '/logout/logout.html',
      controller: 'LogoutCtrl as vm'
    });

    $urlRouterProvider.otherwise('/');

  }

})(window, window.angular);
