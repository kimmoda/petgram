(function (window, angular, undefined) {
  'use strict';
  angular
    .module('app.user')
    .directive('photogramProfileEdit', photogramProfileEdit);

  function photogramProfileEdit($ionicModal, AppConfig, User, UserForm, $state) {
    var path = AppConfig.path;

    return {
      restrict: 'A',
      scope: {
        photogram: '@'
      },
      template: '',
      link: function (scope, elem, attr) {

        scope.linkFacebook = linkFacebook;
        scope.logout = logout;
        scope.submitUpdateProfile = submitUpdateProfile;
        scope.closeModal = closeModal;
        elem.bind('click', openModal);


        function init() {
          scope.form = User.currentUser();
          scope.formFields = UserForm.profile;
        }


        function openModal() {

          init();
          $ionicModal.fromTemplateUrl('js/user/profile/profile.edit.modal.html', {
            scope: scope
          }).then(function (modal) {
            scope.modal = modal;
            scope.modal.show();
          });
        }

        function logout() {
          $state.go('logout');
          scope.closeModal();
        }

        function linkFacebook() {
          User
            .facebookLink()
            .then(function (resp) {
              console.log(resp);
            });
        }

        function submitUpdateProfile() {
          var dataForm = angular.copy(scope.form);
          User
            .update(dataForm)
            .then(function (resp) {
              console.log(resp);
              init();
              scope.closeModal();
            });
        }

        function closeModal() {
          scope.modal.hide();
          scope.modal.remove();
        }
      }
    }
  }

})(window, window.angular);
