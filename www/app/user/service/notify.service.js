'use strict';
angular
    .module ('module.user')
    .factory ('Notify', function ($ionicPopup, $rootScope) {
    return {
        alert      : alert,
        confirm    : confirm,
        showLoading: showLoading,
        hideLoading: hideLoading
    };

    function showLoading () {
        $rootScope.$broadcast ('loading:show');
    }

    function hideLoading () {
        $rootScope.$broadcast ('loading:hide');
    }

    function alert (title, msg) {
        return $ionicPopup.alert ({
            title   : title,
            template: msg
        });
    }

    function confirm (title, msg) {
        return $ionicPopup.confirm ({
            title   : title,
            template: msg
        });
    }
});