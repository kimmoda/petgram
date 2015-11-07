(function (window, angular, undefined) {
  'use strict';
  angular
    .module('app.photogram')
    .controller('UserAvatarCtrl', UserAvatarCtrl)
    .controller('UserMergeCtrl', UserMergeCtrl)
    .controller('UserProfileCtrl', UserProfileCtrl)
    .controller('UserRecoveryPassCtrl', UserRecoveryPassCtrl)
    .controller('UserSigninCtrl', UserSigninCtrl)
    .controller('UserSignupCtrl', UserSignupCtrl);

  function UserSignupCtrl($state, UserForm, Notify, Loading, Photogram, User) {
    var vm = this;
    vm.formFields = UserForm.register;
    vm.submitRegister = submitRegister;

    init();

    function init() {
      vm.form = {
        email: '',
        password: ''
      };
    }

    function submitRegister(rForm, data) {

      if (rForm.$valid) {
        Loading.start();
        var form = angular.copy(data);
        User
          .register(form)
          .then(function (resp) {
            console.log(resp);
            // Add Actvity History
            Photogram
              .addActivity({
                action: 'registered'
              });

            // After register, login
            User
              .login({
                email: form.email,
                password: form.password
              })
              .then(function (data) {
                console.log(data);
                User.init();
                Loading.end();
                $state.go('useravatar', {
                  clear: true
                });
              })
              .catch(function (resp) {
                console.log(resp);
                Loading.end();
                Notify.alert({
                  title: 'Ops',
                  text: resp.message
                });
              });
          })
          .catch(function (resp) {
            console.log(resp);
            Loading.end();
            Notify.alert({
              title: 'Ops',
              text: resp.message
            });
          });
      }
    }
  }


  function UserSigninCtrl(AppConfig, UserForm, Loading, $state, gettextCatalog, Notify, User) {
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

      if (window.Parse.User.current()) {
        $state.go(vm.routeLogged, {
          clear: true
        });
      }

    }

    function submitLogin(rForm, data) {

      var form = angular.copy(data);
      if (rForm.$valid) {
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
          })
          .catch(function (resp) {
            Notify.alert({
              title: 'Ops',
              text: resp.message
            });
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
            })
            break;
          }
        })
        .catch(function () {
          Loading.end();
          Notify.alert({
            title: 'Ops',
            text: gettextCatalog.getString('Facebook error')
          });
        });
    }

  }


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


  function UserMergeCtrl(User, $rootScope, AppConfig, $state, gettextCatalog, Notify, UserForm) {
    var vm = this;
    vm.submitMerge = submitMerge;
    init();

    function init() {
      vm.form = $rootScope.tempUser;
      vm.form.password = '';
    }

    function submitMerge() {

      if (vm.form.password != '') {
        var dataForm = angular.copy(vm.form);
        var form = {
          email: dataForm.email,
          password: dataForm.password
        };

        console.log(form);

        User
          .login(form)
          .then(function (user) {
            console.log(user);
            User
              .facebookLink(user)
              .then(function (resp) {
                console.log(resp);
                $state.go(AppConfig.routes.home, {
                  clear: true
                })
              })
          })
          .catch(function (resp) {
            Notify.alert({
              title: 'Ops',
              text: resp.message
            });
          });
      } else {
        Notify.alert({
          title: gettextCatalog.getString('Invalid form'),
          text: gettextCatalog.getString('Please enter your email')
        });
      }

    }

  }




  function UserAvatarCtrl(User, AppConfig, $state, gettextCatalog, Notify, UserForm) {
    var vm = this;
    vm.submitAvatar = submitAvatar;
    init();

    function init() {
      vm.form = User.currentUser();
      vm.formFields = UserForm.profile;
      console.log(vm.form);
    }

    function submitAvatar() {
      console.log(vm.rForm);

      if (vm.rForm.$valid) {
        var dataForm = angular.copy(vm.form);
        console.log(dataForm);

        User
          .update(dataForm)
          .then(function (resp) {
            console.log(resp);
            User.init();
            $state.go(AppConfig.routes.home, {
              clear: true
            })
          });
      } else {
        Notify.alert({
          title: gettextCatalog.getString('Invalid form'),
          text: gettextCatalog.getString('Fill out the fields in red')
        });
      }

    }

  }

})(window, window.angular);
