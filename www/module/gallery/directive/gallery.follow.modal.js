(function (window, angular, undefined) {
  'use strict';
  angular
    .module('module.gallery')
    .directive('galleryFollow', galleryFollow);

  function galleryFollow($ionicModal, Gallery) {
    return {
      restrict: 'A',
      scope: {
        user: '='
      },
      link: function (scope, elem, attr) {
        elem.bind('click', openModal);
        scope.closeModal = closeModal;

        function openModal() {
          $ionicModal.fromTemplateUrl('module/gallery/view/gallery.follow.modal.html', {
            scope: scope
          }).then(function (modal) {
            scope.modalFollow = modal;
            console.log('Open modal follow', scope.user);

            Gallery
              .getFollow(scope.user)
              .then(function (resp) {
                console.log(resp);
                scope.data = resp;
                scope.modalFollow.show();
              });

          });
        }

        function closeModal() {
          scope.modalFollow.hide();
          scope.modalFollow.remove();
        }
      }
    }
  }
})(window, window.angular);
