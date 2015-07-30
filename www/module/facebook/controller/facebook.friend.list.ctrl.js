'use strict';
angular
    .module ('module.facebook')
    .controller ('FacebookFriendListCtrl', function (User) {
    var self = this;

    self.inviteFriends = function () {
        User
            .facebookInvite ()
            .then (function (resp) {
            console.log (resp);
        });
    };

    self.data = [];
    User
        .facebookAPI ('/me/friends')
        .then (function (resp) {
        console.log (resp);
        self.data = resp.data;
    });

});