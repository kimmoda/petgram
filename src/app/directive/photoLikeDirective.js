(function () {
    'use strict';
    angular.module('starter').directive('photoLike', photoLikeDirective);

    function photoLikeDirective(Gallery) {
        return {
            restrict: 'A',
            scope   : {
                ngModel: '='
            },
            link    : function (scope, elem) {
                elem.bind('click', function () {
                        var _model      = scope.ngModel;
                        _model.progress = true;
                        _model.liked    = !_model.liked;

                        Gallery.likeGallery({galleryId: scope.ngModel.galleryObj.id}).then(function (resp) {
                            console.log(resp);
                            _model.likes    = resp.likes;
                            _model.progress = false;
                            console.log(_model, resp);
                            if (resp.action === 'like') {
                                scope.ngModel.isLiked = true;
                                scope.ngModel.likesTotal += 1;
                            }

                            if (resp.action === 'unlike') {
                                scope.ngModel.isLiked = false;
                                scope.ngModel.likesTotal -= 1;
                            }
                        });
                    }
                );

            }
        };
    }


})();
