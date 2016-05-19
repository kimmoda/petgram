(function () {
    'use strict';
    /**
     * @ngdoc controller
     * @name UserLoginCtrl
     *
     * @description
     * _Please update the description and dependencies._
     *
     * @requires $scope
     * */
    angular
        .module('app.user')
        .controller('UserLoginCtrl', UserLoginController);

    function UserLoginController(AppConfig) {
        var vm       = this;
        vm.languages = AppConfig.locales;
        vm.language  = vm.languages[0];
    }

})();