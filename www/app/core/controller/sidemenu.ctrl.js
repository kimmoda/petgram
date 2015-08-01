'use strict';
angular
    .module ('module.core')
    .controller ('SidemenuCtrl', function ($scope, $ionicSideMenuDelegate, $rootScope) {
    var self = this;

    // self.tabs = $rootScope.menu;
    
})
    .directive('zoomIn', function ($timeout, $ionicSideMenuDelegate) {
  return {restrict: 'A',
    link: function ($scope, $element, $attr) {
      // Run in the next scope digest
      $timeout(function () {
        $scope.$watch(function () {
          return $ionicSideMenuDelegate.getOpenRatio();
        },function (ratio) {
          var transform = "scale(" + ratio + ")" +
                          "translate3d(" + (100-(Math.abs(ratio)*100)) + "%,0, 0) ";
            $element[0].style.transform = transform;
            $element[0].style.webkitTransform = transform;
        });
      });
    }
  }
});

