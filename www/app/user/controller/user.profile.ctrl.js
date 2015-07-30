'use strict';
angular
    .module ('module.user')
    .controller ('UserProfileCtrl', function ($rootScope, User, UserForm) {
    var self = this;

    self.form       = $rootScope.user;
    self.formFields = UserForm.profile;

    // Set Motion
    self.submitProfile = function (rForm, form) {
        if (rForm.$valid) {
            var formData = angular.copy (form);
            User
                .update (formData)
                .then (function (resp) {
                    console.log (resp);
                });
        }
    };

});
