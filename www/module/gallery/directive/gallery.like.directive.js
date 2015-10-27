(function (window, angular, undefined) {
  'use strict';
  angular
    .module('module.gallery')
    .directive('galleryLike', galleryLike);

  function galleryLike(Gallery) {
    return {
      restrict: 'A',
      scope: {
        ngModel: '='
      },
      link: function (scope, elem, attr) {
        elem.bind('click', likeGallery);

        function likeGallery() {

          console.log('gallery', scope.ngModel);
          var gallery = scope.ngModel.item;
          gallery.likeProgress = true;
          Gallery
            .likeGallery(scope.ngModel.id)
            .then(function (resp) {
              gallery.liked = resp.liked;
              gallery.qtdLike = resp.likes;
              delete gallery.likeProgress;
              console.log(gallery, resp);
            });
          scope.$apply();
        }
      }
    }
  }
})(window, window.angular);
