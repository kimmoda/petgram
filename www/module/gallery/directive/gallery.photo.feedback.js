(function (window, angular, undefined) {
  'use strict';
  angular
    .module('module.gallery')
    .directive('galleryPhotoFeedback', galleryPhotoFeedback);

  function galleryPhotoFeedback($ionicModal, $rootScope, $cordovaSocialSharing, gettextCatalog,
    GalleryFeedback, GalleryFeedbackForm, $state) {
    return {
      restrict: 'A',
      scope: {
        gallery: '@'
      },
      template: '',
      link: function (scope, elem, attr) {

        scope.link = link;
        scope.submitFeedback = submitFeedback;
        scope.closeModal = closeModal;
        elem.bind('click', openModal);

        function init() {
          scope.form = {
            galleryId: scope.gallery
          };
          scope.formFields = GalleryFeedbackForm.form;
        }

        function openModal() {

          init();
          $ionicModal.fromTemplateUrl('module/gallery/view/gallery.photo.feedback.modal.html', {
            scope: scope,
            focusFirstInput: true
          }).then(function (modal) {
            scope.modal = modal;
            scope.modal.show();
          });
        }

        function link(sref) {
          $state.go(sref)
          scope.closeModal();
        }

        function submitFeedback() {
          var dataForm = angular.copy(scope.form);
          GalleryFeedback
            .submit(dataForm)
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
