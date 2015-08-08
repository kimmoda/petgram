'use strict';
angular
    .module ('module.core')
    .controller ('HomeCtrl', function ($rootScope, $state, DashboardSlide) {
    var self = this;

    if (!$rootScope.isLoggedIn) {
        $state.go ('gallery.home');
    }

    DashboardSlide
        .all ()
        .then (function (resp) {
        self.slideshow = resp;
    });


    self.menu = $rootScope.menu;

});
