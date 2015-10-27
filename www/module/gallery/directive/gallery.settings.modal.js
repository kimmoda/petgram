(function (window, angular, undefined) {
  'use strict';
  angular
    .module('module.gallery')
    .directive('gallerySettings', gallerySettings);

  function gallerySettings($ionicModal, $cordovaInAppBrowser, $rootScope, GalleryShare, User, UserForm, $state) {
    return {
      restrict: 'A',
      scope: {
        gallery: '@'
      },
      template: '',
      link: function (scope, elem, attr) {

        elem.bind('click', openModal);
        scope.closeModal = closeModal;
        scope.link = link;
        scope.openLink = openLink;
        scope.changeLanguage = changeLanguage;
        scope.share = GalleryShare.share;

        function init() {
          scope.form = User.currentUser();
          scope.formFields = UserForm.profile;
          scope.languages = $rootScope.langs;
          scope.language = $rootScope.lang;
        }

        function openModal() {

          init();
          $ionicModal.fromTemplateUrl('module/gallery/view/gallery.settings.modal.html', {
            scope: scope
          }).then(function (modal) {
            scope.modal = modal;
            scope.modal.show();
          });
        }

        function link(sref) {
          $state.go(sref)
          scope.closeModal();
        }

        function openLink(url) {
          var options = {
            location: 'yes',
            clearcache: 'yes',
            toolbar: 'yes'
          };

          $cordovaInAppBrowser.open(url, '_blank', options);
        }

        function changeLanguage(language) {
          scope.form.language = language;
          submitUpdateProfile(scope.form);
          $rootScope.setLanguage(language);
        }


        function submitUpdateProfile(form) {
          var dataForm = angular.copy(form);
          User
            .update(dataForm)
            .then(function (resp) {
              console.log(resp);
              init();
              scope.closeModal();
            })
        }

        function closeModal() {
          scope.modal.hide();
          scope.modal.remove();
        }

      }
    }
  }
})(window, window.angular);
