(function (window, angular, undefined) {
  'use strict';
  angular
    .module('ionic-loading', [
      'ionic'
    ])
    .directive('ionLoading', ionLoading)
    .factory('Loading', Loading)
    .run(runLoading);

  function ionLoading() {
    return {
      restrict: 'E',
      scope: {
        icon: '@',
        loading: '='
      },
      template: '<div class="padding text-center loading" ng-show="loading"><ion-spinner icon="{{ icon }}"></ion-spinner></div>'
    }
  }

  function Loading($rootScope, $timeout) {

    var seconds = 0;

    function showLoading() {
      $rootScope.$broadcast('ionicLoading:true');
    }

    function hideLoading() {
      $timeout(function () {
        $rootScope.$broadcast('ionicLoading:false');
      }, parseInt(seconds + '000'));
    }

    return {
      start: showLoading,
      end: hideLoading,
    }
  }

  function runLoading($rootScope, $ionicLoading) {
    //Loading

    $rootScope.$on('ionicLoading:true', function () {
      $rootScope.loading = true;
      $ionicLoading.show();
    });
    $rootScope.$on('ionicLoading:false', function () {
      $rootScope.loading = false;
      $ionicLoading.hide();
    });
  }
})(window, window.angular);
