(function (window, angular, undefined) {
    'use strict';
    angular
        .module('app.photogram')
        .directive('photogramPhotoFeedback', photogramPhotoFeedback);


    function photogramPhotoFeedback($ionicModal, AppConfig, PhotogramFeedback, PhotogramFeedbackForm, $state) {

        var path = AppConfig.path;

        return {
            restrict: 'A',
            scope: {
                photogram: '@'
            },
            template: '',
            link: function (scope, elem, attr) {

                scope.link = link;
                scope.submitFeedback = submitFeedback;
                scope.closeModal = closeModal;
                elem.bind('click', openModal);

                function init() {
                    scope.form = {
                        photogramId: scope.photogram
                    };
                    scope.formFields = PhotogramFeedbackForm.form;
                }

                function openModal() {

                    init();
                    $ionicModal.fromTemplateUrl(path + '/feedback/photogram.photo.feedback.modal.html', {
                        scope: scope,
                        focusFirstInput: true
                    }).then(function (modal) {
                        scope.modal = modal;
                        scope.modal.show();
                    });
                }

                function link(sref) {
                    $state.go(sref)
                    scope.closeModal();
                }

                function submitFeedback() {
                    var dataForm = angular.copy(scope.form);
                    PhotogramFeedback
                        .submit(dataForm)
                        .then(function (resp) {
                            console.log(resp);
                            init();
                            scope.closeModal();
                        })
                }


                function closeModal() {
                    scope.modal.hide();
                    scope.modal.remove();
                }

            }
        }
    }

})(window, window.angular);