(function(){
    'use strict';
    angular
        .module('module.gallery')
        .directive('galleryLoading', function () {
            return {
                restrict   : 'E',
                scope      : {
                    loading: '=',
                    icon   : '@'
                },
                templateUrl: 'module/gallery/view/gallery.loading.directive.html'
            }
        });
})();