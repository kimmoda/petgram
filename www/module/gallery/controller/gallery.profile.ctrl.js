'use strict';
angular
    .module ('module.gallery')
    .controller ('GalleryProfileCtrl', function ($rootScope, UserForm, User) {
        var self        = this;
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
