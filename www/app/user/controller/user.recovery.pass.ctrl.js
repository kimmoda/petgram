'use strict';
angular
    .module ('module.user')
    .controller ('RecoveryPassCtrl', function (User, $state, Notify) {
    var self          = this;
    self.form         = {};
    self.submitForgot = function () {
        User.forgot (self.form).then (function (resp) {
            console.log (resp);
        }).catch (function (resp) {
            Notify.alert ('Ops', resp);
        });
    };
});