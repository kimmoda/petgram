(function () {
  'use strict';
  /**
   * @ngdoc controller
   * @name UserSigninCtrl
   *
   * @description
   * _Please update the description and dependencies._
   *
   * @requires $scope
   * */
  angular
    .module('app.user')
    .controller('UserLoginCtrl', UserLoginCtrl);

  function UserLoginCtrl(AppConfig, UserForm, Parse, Loading, $state, Notify, User) {
    var vm = this;
    vm.formFields = UserForm.login;
    vm.routeLogged = AppConfig.routes.home;
    vm.submitLogin = submitLogin;
    vm.facebook = facebook;

    init();

    function init() {
      vm.form = {
        email: '',
        password: ''
      };

      if (Parse.User.current()) {
        $state.go(vm.routeLogged, {
          clear: true
        });
      }

    }

    function submitLogin(rForm, data) {

      var form = angular.copy(data);
      if (rForm.$valid) {
        Loading.start();
        User
          .login(form)
          .then(function (data) {

            console.log(data);

            if (data.name.length) {
              $state.go(vm.routeLogged, {
                clear: true
              });
            } else {
              $state.go('useravatar', {
                clear: true
              });
            }
            Loading.end();
          })
          .catch(function (resp) {
            Notify.alert({
              title: 'Ops',
              text: resp.message
            });
            Loading.end();
          });
      } else {
        return false;
      }
    }

    function facebook() {
      Loading.start();
      User
        .facebookLogin()
        .then(function (resp) {
          console.log(resp);

          Loading.end();
          switch (resp.status) {
          case 0:
            // logado
            $state.go(AppConfig.routes.home, {
              clear: true
            });
            break;
          case 1:
            // novo user
            $state.go('useravatar', {
              clear: true
            });
            break;
          case 2:
            // merge
            $state.go('usermerge', {
              clear: true
            });
            break;
          }
        })
        .catch(function () {
          Loading.end();
          Notify.alert({
            title: 'Ops',
            text: ('Facebook error')
          });
        });
    }

  }


})();