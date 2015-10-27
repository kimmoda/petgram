(function (window, angular, undefined) {
  'use strict';
  angular
    .module('module.user')
    .directive('openTerms', openTerms);

  function openTerms($cordovaInAppBrowser) {
    return {
      restrict: 'A',
      template: '',
      link: function (scope, elem, attr) {

        elem.bind('click', openModal);
        scope.closeModal = closeModal;

        function openModal() {
          console.log(scope.ngModel);

          $cordovaInAppBrowser
            .open('http://movibe.github.io/photogram-docs/', '_blank', {
              location: 'no',
              clearcache: 'yes',
              toolbar: 'yes'
            })
            .then(function (event) {
              // success
            })
            .catch(function (event) {
              // error
            });
        }

        function closeModal() {
          scope.modal.hide();
          scope.modal.remove();
        }
      }
    }
  }
})(window, window.angular);
