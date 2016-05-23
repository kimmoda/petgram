(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name buy
   *
   * @description
   * _Please update the description and restriction._
   *
   * @restrict A
   * */

  angular
    .module('app.photogram')
    .directive('buy', buyDirective);

  function buyDirective($cordovaInAppBrowser) {
    return {
      restrict: 'A',
      link: buyLink
    };

    function buyLink(scope, elem, attr) {
      elem.bind('click', function () {
        var options = {
          location: 'yes',
          clearcache: 'yes',
          toolbar: 'yes'
        };

        var lang = navigator.language;
        var url = 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=FAW4JZS7KJM5S';
        if (lang === 'pt-BR') {
          url = 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=FT5W6FJW5RAEN';
        }

        $cordovaInAppBrowser.open(url, '_blank', options);
      });
    }
  }

})();