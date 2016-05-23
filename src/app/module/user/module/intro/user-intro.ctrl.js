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
        .module('app.intro')
        .controller('UserIntroCtrl', UserIntroCtrl);

    function UserIntroCtrl(AppConfig) {
        var vm       = this;
        vm.languages = AppConfig.locales;
        vm.language  = vm.languages[0];
    }

})();