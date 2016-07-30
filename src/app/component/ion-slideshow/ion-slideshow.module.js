(function () {
    'use strict';
    angular.module('ion-slideshow', [])
           .directive('ionSlideshow', function ($ionicModal) {
               return {
                   restrict: 'A',
                   scope   : {
                       ngModel: '=',
                       index  : '='
                   },
                   link    : link
               };

               function link($scope, elem, attr) {

                   elem.bind('click', function () {
                       $scope.allImages   = $scope.ngModel;
                       $scope.activeSlide = $scope.index;

                       console.log($scope.index);

                       $ionicModal.fromTemplateUrl('app/component/ion-slideshow/image-popover.html', {
                           scope: $scope,
                       }).then(function (modal) {
                           $scope.modal = modal;
                           $scope.modal.show();
                       });

                       // Close the modal
                       $scope.closeModal = function () {
                           $scope.modal.hide();
                           $scope.modal.remove()
                       };
                   });


               }
           });

})();