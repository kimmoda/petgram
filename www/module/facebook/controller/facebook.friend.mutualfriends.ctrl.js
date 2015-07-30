'use strict';
angular
    .module ('module.facebook')
    .controller ('FacebookFriendMutualCtrl', function ($scope, User) {
    var self = this;

    console.log ('Mutual');

    self.inviteFriends = function () {
        User
            .facebookInvite ()
            .then (function (resp) {
            console.log (resp);
        });
    };

    User
        .facebookAPI ('/me/invitable_friends')
        .then (function (response) {
        console.log (response);
        self.data = response.data;
    });

});