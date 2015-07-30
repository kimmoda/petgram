'use strict';
angular
    .module ('module.friend')
    .controller ('FriendListCtrl', function (User) {
    var self = this;

    User
        .list ()
        .then (function (resp) {
        console.log (resp);
        self.data = resp;
    });
});