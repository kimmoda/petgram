(function () {
  'use strict';
  angular
    .module('app.photogram')
    .directive('photogramLikeModal', photogramLikeModalDirective);

  function photogramLikeModalDirective($ionicModal, AppConfig, Photogram) {

    var path = AppConfig.path;

    return {
      restrict: 'A',
      scope: {
        photogram: '='
      },
      template: '',
      link: function (scope, elem, attr) {
        scope.formFields = Photogram.formComment;
        scope.submitComment = submitComment;
        scope.closeModal = closeModal;
        elem.bind('click', openModal);

        function openModal() {
          console.log(scope.photogram);

          $ionicModal.fromTemplateUrl(path + '/directive/like/photogram.like.directive.html', {
            scope: scope,
            animation: 'slide-in-up'
          }).then(function (modal) {
            scope.modal = modal;
          });

        }

        function submitComment(rForm, form) {
          if (rForm.$valid) {
            var dataForm = angular.copy(form);
            Photogram
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
    };
  }


})();
