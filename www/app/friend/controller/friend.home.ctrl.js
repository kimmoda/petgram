'use strict';
angular
    .module ('module.friend')
    .controller ('FriendHomeCtrl', function (User) {
    var self = this;

    User
        .list ()
        .then (function (resp) {
        console.log (resp);
        self.data = resp;
    });
});