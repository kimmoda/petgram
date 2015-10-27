(function (window, angular, undefined) {
  'use strict';
  angular
    .module('module.user')
    .factory('Notify', Notify);

  function Notify($ionicPopup) {

    function alert(params) {
      return $ionicPopup.alert({
        title: params.title,
        template: params.text
      });
    }

    function confirm(title, msg) {
      return $ionicPopup.confirm({
        title: title,
        template: msg
      });
    }

    return {
      alert: alert,
      confirm: confirm
    };
  }
})(window, window.angular);
