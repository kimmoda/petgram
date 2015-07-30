'use strict';
angular
    .module ('module.user')
    .controller ('MainCtrl', function ($scope, $stateParams, $rootScope, $ionicHistory, $state) {
    var self = this;

    if ($stateParams.clear) {
        $ionicHistory.clearHistory ();
    }
    self.rightButtons = [{
        type   : 'button-positive',
        content: '<i class="icon ion-navicon"></i>',
        tap    : function (e) {
            $scope.sideMenuController.toggleRight ();
        }
    }];
    self.logout       = function () {
        Parse.User.logOut ();
        $rootScope.user       = null;
        $rootScope.isLoggedIn = false;
        $state.go ('welcome', {clear: true});
    };
    self.toggleMenu   = function () {
        $scope.sideMenuController.toggleRight ();
    };
});