(function(){
    'use strict';
    angular
        .module('module.user')
        .controller('RecoveryPassCtrl', function (User, $state, Notify) {
            var vm          = this;
            vm.form         = {};
            vm.submitForgot = function () {
                User.forgot(vm.form).then(function (resp) {
                    console.log(resp);
                }).catch(function (resp) {
                    Notify.alert('Ops', resp);
                });
            };
        });
})();