(function () {
    'use strict';
    angular
        .module('module.user')
        .factory('Notify', function ($ionicPopup, $rootScope) {
            return {
                alert      : alert,
                confirm    : confirm,
                showLoading: showLoading,
                hideLoading: hideLoading
            };

            function showLoading() {
                $rootScope.$broadcast('loading:show');
            }

            function hideLoading() {
                $rootScope.$broadcast('loading:hide');
            }

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