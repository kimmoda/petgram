(function (window, angular, undefined) {
  'use strict';
  angular
    .module('app.photogram')
    .directive('photogramComment', photogramComment);


  function photogramComment($ionicModal, $timeout, AppConfig, Photogram, PhotogramForm) {

    var path = AppConfig.path;

    return {
      restrict: 'A',
      scope: {
        ngModel: '='
      },
      template: '',
      link: function (scope, elem, attr) {
        scope.formFields = PhotogramForm.formComment;
        scope.submitComment = submitComment;
        scope.closeModal = closeModal;
        elem.bind('click', openModalComment);

        function init() {
          scope.nocomments = false;
          scope.loading = false;
          scope.form = {
            photogramId: scope.ngModel.id,
            text: ''
          };
        }

        function openModalComment() {
          console.log(scope.ngModel);

          init();

          scope.comments = scope.ngModel.comments;
          $timeout(function () {
            if (scope.comments.length === 0) {
              scope.nocomments = true;
            }
          }, 500);


          $ionicModal.fromTemplateUrl(path + '/directives/comment/photogram.comment.directive.html', {
            scope: scope,
            focusFirstInput: true
          }).then(function (modal) {
            scope.modal = modal;
            scope.modal.show();

          });
        }

        function getComments() {
          Photogram
            .getComments(scope.ngModel.id)
            .then(function (resp) {
              scope.comments = resp;
              scope.ngModel.comments = resp;
              scope.loading = false;
            });
        }

        function submitComment(rForm, form) {
          if (rForm.$valid) {
            var dataForm = angular.copy(form);
            scope.loading = true;
            Photogram
              .addComment(dataForm)
              .then(function (resp) {
                console.log(resp);
                getComments();
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
