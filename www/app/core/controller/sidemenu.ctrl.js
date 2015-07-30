'use strict';
angular
    .module ('module.core')
    .controller ('SidemenuCtrl', function ($rootScope) {
    var self = this;

    self.tabs = $rootScope.menu;
});

