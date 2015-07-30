'use strict';
angular
    .module ('module.chat')
    .controller ('ChatListCtrl', function (User, Chat) {
    var self = this;

    self.data = [];

    User
        .list ()
        .then (function (resp) {
        console.log (resp);
        self.data = resp;
    });
});