(function (window, angular, undefined) {
  'use strict';
  angular
    .module('module.gallery')
    .directive('galleryProfile', function ($ionicModal, $q, Gallery, Loading, $timeout, User, UserForm, $state) {
      return {
        restrict: 'A',
        scope: {
          profile: '='
        },
        template: '',
        link: function (scope, elem, attr) {

          function init() {
            console.log(scope.profile);

            var userId = scope.profile;
            var defer = $q.defer();

            Loading.start();

            Gallery
              .getUser(userId)
              .then(function (resp) {
                scope.form = resp;

                Gallery
                  .getUserGallery(userId)
                  .then(function (resp) {
                    scope.data = resp;
                    console.log(resp);
                  })
                  .then(function () {
                    scope.$broadcast('scroll.refreshComplete');
                    scope.$broadcast('scroll.infiniteScrollComplete');
                    scope.loading = false;

                    $timeout(function () {
                      Loading.end();
                    }, 1000);

                    defer.resolve(scope.data);
                  });

              });

            return defer.promise;


          }

          elem.bind('click', function () {

            $ionicModal.fromTemplateUrl('module/gallery/view/gallery.profile.modal.html', {
              scope: scope
            }).then(function (modal) {
              scope.modalProfile = modal;

              init()
                .then(function () {
                  scope.modalProfile.show();
                });
            });
          });

          scope.follow = function (status) {
            Loading.start();
            User
              .follow(status, scope.profile)
              .then(function (resp) {
                Loading.end();
                scope.form.follow = !scope.form.follow;
              });
          };


          scope.logout = function () {
            $state.go('logout');
            scope.closeModal();
          };

          scope.linkFacebook = function () {
            User
              .facebookLink()
              .then(function (resp) {
                console.log(resp);
              })
          };

          scope.submitUpdateProfile = function () {
            var dataForm = angular.copy(scope.form);
            User
              .update(dataForm)
              .then(function (resp) {
                console.log(resp);
                init();
                scope.closeModal();
              });
          };

          scope.closeModal = function () {
            scope.modalProfile.hide();
            scope.modalProfile.remove();
          };
        }
      }
    });
})(window, window.angular);
