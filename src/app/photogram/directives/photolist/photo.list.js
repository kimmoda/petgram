(function () {
  'use strict';
  angular
    .module('app.photogram')
    .directive('photogramPhotoList', photogramPhotoList);


  function photogramPhotoList(AppConfig) {
    var path = AppConfig.path;

    return {
      restrict: 'E',
      scope: {
        data: '=photogram',
        profile: '=',
        loading: '='
      },
      templateUrl: path + '/directives/photolist/photogram.photos.list.html',
      controller: photogramPhotoListCtrl,
      controllerAs: 'vm'
    };
  }

  function photogramPhotoListCtrl(AppConfig, Photogram, $scope, $ionicPopup, PhotogramFeedbackForm, PhotogramFeedback,
    gettextCatalog, $ionicActionSheet, $ionicModal) {
    var vm = this;
    var path = AppConfig.path;
    var user = Parse.User.current();
    var message = {
      title: gettextCatalog.getString('Join me from ') + AppConfig.app.name + '!',
      text: gettextCatalog.getString("I'm at ") + AppConfig.app.name + '! ' + gettextCatalog.getString(
        'Install the application and follow me!'),
      image: '',
      link: AppConfig.app.url
    };

    vm.action = action;
    vm.gallery = {
      src: ''
    };

    function action(gallery) {

      var buttons = [{
        text: '<i class="icon ion-share"></i>' + gettextCatalog.getString('Share')
      }, {
        text: '<i class="icon ion-alert-circled"></i>' + gettextCatalog.getString('Report')
      }];

      var user = Parse.User.current();

      if (user.id === gallery.user.id) {
        var buttonDelete = {
          text: '<i class="icon ion-trash-b"></i>' + gettextCatalog.getString('Delete your photo')
        };
        buttons.push(buttonDelete);
      }
      message.image = gallery.src;
      message.text = gallery.item.title;

      var actionSheet = {
        buttons: buttons,
        titleText: gettextCatalog.getString('Photo'),
        cancelText: gettextCatalog.getString('Cancel'),
        buttonClicked: actionButtons
      };


      function actionButtons(index) {
        switch (index) {
        case 0:
          share(message);
          break;
        case 1:
          openModal(gallery);
          break;
        case 2:

          $ionicPopup
            .confirm({
              title: gettextCatalog.getString('Delete photo'),
              template: gettextCatalog.getString('Are you sure?')
            })
            .then(function (res) {
              if (res) {
                Photogram
                  .deletePhoto(gallery.id)
                  .then(msgDeletePhoto);
              }
            });


        }
        return true;
      }

      function msgDeletePhoto() {
        console.log('Photo deleted');
        $scope.$emit('PhotogramHome:reload');
      }

      // Show the action sheet
      $ionicActionSheet.show(actionSheet);

    }


    function openModal(gallery) {
      $scope.submitFeedback = submitFeedback;
      $scope.closeModal = closeModal;
      $scope.form = {
        photogramId: gallery.id,
        user: user
      };

      $scope.formFields = PhotogramFeedbackForm.form;

      $ionicModal
        .fromTemplateUrl(path + '/feedback/photogram.photo.feedback.modal.html', {
          scope: $scope,
          focusFirstInput: true
        })
        .then(function (modal) {
          vm.modal = modal;
          vm.modal.show();
        });
    }


    function submitFeedback() {
      var dataForm = angular.copy($scope.form);
      PhotogramFeedback
        .submit(dataForm)
        .then(function (resp) {
          console.log(resp);
          closeModal();
        });
    }


    function closeModal() {
      vm.modal.hide();
      vm.modal.remove();
      delete vm.modal;
    }


    function success() {
      //Notify.alert({
      //    title: gettextCatalog.getString('Thanks'),
      //    text: gettextCatalog.getString('Thank you for sharing!!')
      //});
    }

    function error(err) {
      console.error(err);
    }

    function share(post) {
      console.log('Social Share', post);
      var message = gettextCatalog.getString("I'm at ") + AppConfig.app.name + '! ' + gettextCatalog.getString(
        'Install the application and follow me!') + ' ' + AppConfig.app.url;
      window
        .plugins
        .socialsharing
        .share(post.text + ', ' + message, post.text, post.image, null);
    }

  }


})();
