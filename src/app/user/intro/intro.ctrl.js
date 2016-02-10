(function () {
  'use strict';
  angular
    .module('app.user')
    .controller('IntroCtrl', IntroCtrl);

  function IntroCtrl(gettextCatalog, $ionicSlideBoxDelegate) {
    var vm = this;
    var currentPlatform = window.ionic.Platform.platform();
    vm.slideIndex = 0;
    vm.slideChanged = slideChanged;
    vm.next = function () {
      $ionicSlideBoxDelegate.next();
    };
    vm.previous = function () {
      $ionicSlideBoxDelegate.previous();
    };



    if (currentPlatform) {
      vm.device = (currentPlatform == 'android') ? 'android' : 'iphone';
    } else {
      vm.device = 'android';
    }

    vm.slides = [{
        top: gettextCatalog.getString('Capture moments...'),
        img: 'img/intro1.jpg'
      }, {
        top: gettextCatalog.getString('...and share them to friends'),
        img: 'img/intro4.jpg'
      }

    ];

    function slideChanged(index) {
      vm.slideIndex = index;
    }


  }

})();
