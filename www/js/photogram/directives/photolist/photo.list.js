(function (window, angular, Parse, undefined) {
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
                loading: '='
            },
            templateUrl: path + '/directives/photolist/photogram.photos.list.html',
            controller: ActionCtrl,
            controllerAs: 'vm'
        }
    }

    function ActionCtrl(AppConfig, $scope, $cordovaSocialSharing, Notify, PhotogramFeedbackForm, PhotogramFeedback, gettextCatalog, $ionicActionSheet, $ionicModal) {
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

            console.log(gallery);
            message.image = gallery.src;

            var actionSheet = {
                buttons: [
                    {
                        text: '<i class="icon ion-social-facebook"></i>' + gettextCatalog.getString('Share in Facebook')
                    },
                    {
                        text: '<i class="icon ion-social-twitter"></i>' + gettextCatalog.getString('Share in Twitter')
                    }, {
                        text: '<i class="icon ion-social-whatsapp"></i>' + gettextCatalog.getString('Share in Whatsapp')
                    }, {
                        text: '<i class="icon ion-email"></i>' + gettextCatalog.getString('Share in Email')
                    },
                    {
                        text: '<i class="icon ion-alert-circled"></i>' + gettextCatalog.getString('Report')
                    }
                ],
                titleText: gettextCatalog.getString('Photo'),
                cancelText: gettextCatalog.getString('Cancel'),
                buttonClicked: function (index) {
                    console.log(index);
                    console.log(index);
                    switch (index) {
                        case 0:
                            share('facebook');
                            break;
                        case 1:
                            share('twitter');
                            break;
                        case 2:
                            share('whatsapp');
                            break;
                        case 3:
                            share('email');
                            break;
                        case 4:
                            openModal(gallery);
                            break;
                    }

                    return true;
                }
            };

            if (gallery.user === user) {
                actionSheet.destructiveText = 'Delete';
                actionSheet.destructiveButtonClicked = deletePhoto;
            }

            // Show the action sheet
            $ionicActionSheet.show(actionSheet);

        }

        function deletePhoto() {

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
                }).then(function (modal) {
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
                })
        }


        function closeModal() {
            vm.modal.hide();
            vm.modal.remove();
            delete vm.modal;
        }


        function success() {
            Notify.alert({
                title: gettextCatalog.getString('Thanks'),
                text: gettextCatalog.getString('Thank you for sharing!!')
            });
        }

        function error(err) {
            console.error(err);
        }

        function share(social) {
            switch (social) {
                case 'facebook':
                    $cordovaSocialSharing
                        .shareViaFacebook(message.text, message.image, message.link)
                        .then(success, error);
                    break;

                case 'twitter':
                    $cordovaSocialSharing
                        .shareViaTwitter(message.text, message.image, message.link)
                        .then(success, error);
                    break;

                case 'whatsapp':
                    $cordovaSocialSharing
                        .shareViaWhatsApp(message.text, message.image, message.link)
                        .then(success, error);
                    break;

                case 'email':
                    $cordovaSocialSharing
                        .shareViaEmail(message.title, message.subject)
                        .then(success, error);
                    break;
            }
        }

    }


})(window, window.angular, window.Parse);