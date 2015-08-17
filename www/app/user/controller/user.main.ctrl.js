(function () {
    'use strict';
    angular
        .module('module.user')
        .controller('MainCtrl', function ($scope, $stateParams, $rootScope, $ionicHistory, $state) {
            var vm = this;

            if ($stateParams.clear) {
                $ionicHistory.clearHistory();
            }
            vm.rightButtons = [
                {
                    type   : 'button-positive',
                    content: '<i class="icon ion-navicon"></i>',
                    tap    : function (e) {
                        $scope.sideMenuController.toggleRight();
                    }
                }
            ];
            vm.logout       = function () {
                Parse.User.logOut();
                $rootScope.user       = null;
                $rootScope.isLoggedIn = false;
                $state.go('welcome', {clear: true});
            };
            vm.toggleMenu   = function () {
                $scope.sideMenuController.toggleRight();
            };
        });
})();