(function () {
  'use strict';
  angular
    .module('app.photogram')
    .directive('photogramLike', photogramLikeDirective)
    ;
  
  function photogramLikeDirective(Photogram) {
    return {
      restrict: 'A',
      scope: {
        ngModel: '='
      },
      link: function (scope, elem) {
        elem.bind('click', likePhotogram);

        function likePhotogram() {

          console.log('photogram', scope.ngModel);
          var _model = scope.ngModel;
          _model.progress = true;
          _model.liked = !_model.liked;
          Photogram
            .likeGallery(scope.ngModel.id)
            .then(function (resp) {
              _model.likes = resp.likes;
              _model.progress = false;
              console.log(_model, resp);
            });
          scope.$apply();
        }
      }
    };
  }



})();
