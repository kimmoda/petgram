(function (window, angular, undefined) {
  'use strict';
  angular
    .module('module.gallery')
    .controller('GalleryPhotoCtrl', GalleryPhotoCtrl);

  function GalleryPhotoCtrl($stateParams, Gallery) {
    var vm = this;

    vm.formFields = Gallery.formComment;
    vm.submitComment = submitComment;
    init();

    Gallery
      .get($stateParams.id)
      .then(function (resp) {
        vm.data = resp;
      });

    function init() {
      vm.form = {
        galleryId: $stateParams.id,
        text: ''
      };

      loadComments();
    }

    function loadComments() {
      Gallery
        .allComment($stateParams.id)
        .then(function (resp) {
          console.log(resp);
          vm.comments = resp;
        });
    };

    function submitComment(rForm, form) {
      if (rForm.$valid) {
        var dataForm = angular.copy(form);
        Gallery
          .addComment(dataForm)
          .then(function (resp) {
            console.log(resp);
            loadComments();
          });
      }
    }

  }
})(window, window.angular);
