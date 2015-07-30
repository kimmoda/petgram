'use strict';
angular
    .module ('module.facebook')
    .controller ('FacebookFeedCtrl', function ($scope, $timeout, Notify, User) {

    var self  = this;
    self.data = [];

    function loadFeed () {
        Notify.showLoading ();
        User
            .facebookAPI ('/me/feed')
            .then (function (response) {
            console.log (response);
            self.data = response.data;
            Notify.hideLoading ();
            $scope.$broadcast ('scroll.refreshComplete');
        });
    }

    self.refreshFeed = loadFeed;
    loadFeed ();
});
