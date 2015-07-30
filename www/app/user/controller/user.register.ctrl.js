'use strict';
angular
    .module ('module.user')
    .controller ('RegisterCtrl', function ($state, UserForm, $filter, Notify, User) {
    var self = this;

    self.form = {

    };

    self.formFields = UserForm.register;

    self.submitRegister = function (rForm, data) {

        if (rForm.$valid) {
            var form = angular.copy (data);
            User
                .register (form)
                .then (function (resp) {
                console.log (resp);
                $state.go ('app.home', {clear: true});
            }).catch (function (resp) {
                console.log (resp);
                Notify.alert ('Ops', resp);
            });
        }
    };
});