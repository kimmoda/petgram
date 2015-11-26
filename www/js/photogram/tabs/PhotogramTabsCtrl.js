(function (window, angular, undefined) {
  'use strict';
  /**
   * @ngdoc controller
   * @name PhotogramTabsCtrl
   *
   * @description
   * _Please update the description and dependencies._
   *
   * @requires $scope
   * */
  angular
    .module('app.photogram')
    .controller('PhotogramTabsCtrl', PhotogramTabsController);

  function PhotogramTabsController($scope, $state, AppConfig, Photogram, $ionicModal, Loading, PhotogramSetting,
    PhotoService) {
    var vm = this;
    var path = AppConfig.path;
    vm.postPhoto = open;

    function open() {
      var option = {
        allowEdit: PhotogramSetting.get('imageEdit'),
        filter: PhotogramSetting.get('imageFilter'),
        allowRotation: PhotogramSetting.get('imageRotation'),
        quality: PhotogramSetting.get('imageQuality'),
        correctOrientation: PhotogramSetting.get('imageEdit'),
        targetWidth: PhotogramSetting.get('imageWidth'),
        targetHeight: PhotogramSetting.get('imageHeight'),
        saveToPhotoAlbum: PhotogramSetting.get('imageSaveAlbum')
      };

      console.log(option);

      PhotoService
        .open(option)
        .then(modalPost)
        .catch(goHome);
    }

    function goHome() {
      console.warn('Deu erro');
      $state.go('photogram.home');
    }

    function modalPost(image) {
      console.log('ModalPost', image);
      $scope.closePost = closeModalPost;
      $scope.submitPost = submitPost;
      $scope.form = {
        title: '',
        location: '',
        photo: image,
        geo: false
      };
      $ionicModal
        .fromTemplateUrl(path + '/share/photogram.post.modal.html', {
          scope: $scope,
          focusFirstInput: true
        })
        .then(function (modal) {
          $scope.modalPost = modal;
          $scope.modalPost.show();
        });

      function closeModalPost() {
        $scope.modalPost.hide();
        $scope.modalPost.remove();
        Loading.end();
      }

      function submitPost(resp) {
        var form = angular.copy(resp);
        console.log(form);
        Loading.start();
        Photogram
          .post(form)
          .then(sharePhoto);
      }

      function sharePhoto(resp) {
        console.log('SharePhoto', resp);
        closeModalPost();
        PhotoService.share(resp);
      }

    }


  }

})(window, window.angular);
