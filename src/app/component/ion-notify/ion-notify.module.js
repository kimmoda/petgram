(function () {
  'use strict';

  angular
    .module('ion-notify', ['ionic'])
    .factory('Notify', NotifyFactory);

  function NotifyFactory($ionicPopup) {

    return {
      alert: alert,
      confirm: confirm
    };

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
  }


})();
