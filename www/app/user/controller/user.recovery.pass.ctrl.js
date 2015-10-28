(function (window, angular, undefined) {
  'use strict';
  angular
    .module('module.user')
    .controller('UserRecoveryPassCtrl', UserRecoveryPassCtrl);

  function UserRecoveryPassCtrl(User, Notify) {
    var vm = this;
    vm.form = {};
    vm.submitForgot = submitForgot;

    function submitForgot() {
      User.forgot(vm.form).then(function (resp) {
        console.log(resp);
      }).catch(function (resp) {
        Notify.alert('Ops', resp);
      });
    }
  }
})(window, window.angular);
