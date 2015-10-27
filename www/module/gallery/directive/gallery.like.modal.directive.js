(function (window, angular, undefined) {
  'use strict';
  angular
    .module('module.gallery')
    .directive('galleryLikeModal', galleryLikeModal);

  function galleryLikeModal($ionicModal, Gallery) {
    return {
      restrict: 'A',
      scope: {
        gallery: '='
      },
      template: '',
      link: function (scope, elem, attr) {
        scope.formFields = Gallery.formComment;
        scope.submitComment = submitComment;
        scope.closeModal = closeModal;
        elem.bind('click', openModal);

        function openModal() {
          console.log(scope.gallery);

          $ionicModal.fromTemplateUrl('module/gallery/view/gallery.like.directive.html', {
            scope: scope,
            animation: 'slide-in-up'
          }).then(function (modal) {
            scope.modal = modal;
          });

        }

        function submitComment(rForm, form) {
          if (rForm.$valid) {
            var dataForm = angular.copy(form);
            Gallery
              .addComment(dataForm)
              .then(function (resp) {
                console.log(resp);
                scope.closeModal();
              });
          }
        }

        function closeModal() {
          scope.modal.hide();
          scope.modal.remove();
        }

      }
    }
  }
})(window, window.angular);
