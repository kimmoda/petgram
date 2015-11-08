(function (window, angular, undefined) {
  'use strict';
  angular
    .module('app.photogram')
    .directive('userAvatar', userAvatar)
    .directive('recoveryPass', recoveryPass)
    .directive('openTerms', openTerms);

  function openTerms($cordovaInAppBrowser, AppConfig) {
    return {
      restrict: 'A',
      template: '',
      link: function (scope, elem, attr) {

        elem.bind('click', openModal);
        scope.closeModal = closeModal;

        function openModal() {
          console.log(scope.ngModel);

          $cordovaInAppBrowser
            .open(AppConfig.app.url, '_blank', {
              location: 'no',
              clearcache: 'yes',
              toolbar: 'yes'
            })
            .then(function (event) {
              // success
            })
            .catch(function (event) {
              // error
            });
        }

        function closeModal() {
          scope.modal.hide();
          scope.modal.remove();
        }
      }
    }
  }


  function recoveryPass(User, $ionicPopup, gettextCatalog, Loading, Notify) {
    return {
      restrict: 'A',
      scope: {
        login: '@',
        register: '@',
      },
      link: function ($scope, elem, attr) {

        elem.bind('click', openModal);

        function openModal() {

          $scope.form = {
            recovery: ''
          };

          $scope.erro = '';

          $scope.text = {
            button: gettextCatalog.getString(''),
            input: gettextCatalog.getString('Email')
          };

          $ionicPopup
            .show({
              scope: $scope,
              template: '<div class="popup-recovery"><form name="form.recovery" form-manager><label class="item item-input"><i class="icon ion-email placeholder-icon"></i><input type="email" ng-model="email" id="email" name="email" placeholder="{{ text.input }}" required ng-maxlength="80"></label><span class="error-msg">{{erro}}</span></form></div>',
              title: gettextCatalog.getString('A new password will be sent to your e-mail address'),
              buttons: [{
                text: gettextCatalog.getString('Cancel'),
                type: 'button-calm'
              }, {
                text: gettextCatalog.getString('Send'),
                type: 'button-positive',
                onTap: function (e) {
                  if ($scope.form.recovery.$valid) {
                    return $scope.form.recovery.email.$viewValue;
                  } else {
                    //não permite o usuário fechar até ele digitar o email
                    e.preventDefault();
                    $scope.erro = gettextCatalog.getString('Invalid Email');
                  }
                }
              }]
            })
            .then(function (res) {
              if (!angular.isUndefined(res)) {
                var email = res;

                console.log(res);

                Loading.start();

                User
                  .forgot(email)
                  .then(function (resp) {
                    console.log(resp);
                    Notify.alert({
                      login: gettextCatalog.getString('Forgot your password'),
                      text: gettextCatalog.getString('Access your accout mail')
                    });
                    Loading.end();
                  })
                  .catch(function (resp) {
                    Notify.alert({
                      login: 'Ops',
                      text: resp
                    });
                    Loading.end();
                  });
              }
            });

        }
      }
    }
  }

  function userAvatar(PhotoService, User) {
    return {
      restrict: 'A',
      scope: {
        gallery: '@'
      },
      template: '',
      link: function ($scope, elem, attr) {

        elem.bind('click', openModal);

        function openModal() {

          PhotoService
            .open()
            .then(function (imageData) {
              User
                .updateAvatar(imageData)
                .then(function (resp) {
                  console.log(resp);
                });
            })
            .catch(function (resp) {
              console.log(resp);
            });
        }

      }
    }
  }

})(window, window.angular);
