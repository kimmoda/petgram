(function () {
    'use strict';
    angular
        .module('ionic-notify', ['ionic'])
        .factory('Notify', function ($ionicPopup) {
            return {
                alert  : alert,
                confirm: confirm
            };

            function alert(params) {
                return $ionicPopup.alert({
                    title   : params.title,
                    template: params.text
                });
            }

            function confirm(title, msg) {
                return $ionicPopup.confirm({
                    title   : title,
                    template: msg
                });
            }
        });
})();