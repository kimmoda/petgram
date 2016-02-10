(function () {
  'use strict';
  angular
    .module('app.intro')
    .controller('IntroCtrl', IntroCtrl);

  function IntroCtrl($ionicSlideBoxDelegate, $translate) {
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
      vm.device = (currentPlatform === 'android') ? 'android' : 'iphone';
    } else {
      vm.device = 'android';
    }

    console.log($translate.instant('INTRO.STEP1'));
    vm.slides = [{
<<<<<<< HEAD:src/app/user/intro/intro.ctrl.js
        top: gettextCatalog.getString('Capture moments...'),
        img: 'img/intro1.jpg'
      }, {
        top: gettextCatalog.getString('...and share them to friends'),
        img: 'img/intro4.jpg'
=======
        top: $translate.instant('INTRO.STEP1'),
        img: 'img/intro1.jpg'
      }, {
        top: $translate.instant('INTRO.STEP2'),
        img: 'img/intro2.jpg'
      }, {
        top: $translate.instant('INTRO.STEP3'),
        img: 'img/intro3.jpg'
      }, {
        top: $translate.instant('INTRO.STEP4'),
        img: 'img/intro4.jpg'
      }, {
        top: $translate.instant('INTRO.STEP5'),
        img: 'img/intro5.jpg'
>>>>>>> origin/master:src/app/module/intro/controller/intro.ctrl.js
      }

    ];

    function slideChanged(index) {
      vm.slideIndex = index;
    }


  }

})();
