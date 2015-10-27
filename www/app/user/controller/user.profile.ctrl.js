(function (window, angular, undefined) {
  'use strict';
  angular
    .module('module.user')
    .controller('UserProfileCtrl', UserProfileCtrl);

  function UserProfileCtrl($rootScope, User, UserForm) {
    var vm = this;
    vm.form = $rootScope.user;
    vm.formFields = UserForm.profile;
    vm.submitProfile = submitProfile;

    function submitProfile(rForm, form) {
      if (rForm.$valid) {
        var formData = angular.copy(form);
        User
          .update(formData)
          .then(function (resp) {
            console.log(resp);
          });
      }
    }

  }

})(window, window.angular);
