(function () {
    'use strict';

    angular
        .module('starter')
        .directive('settingsModal', settingsModalDirective);

    function settingsModalDirective($ionicModal, $translate, AppConfig, $cordovaInAppBrowser, Share, Auth, User, UserForm, $state) {

        return {
            restrict: 'A',
            template: '',
            link    : function (scope, elem) {

                elem.bind('click', openModal);
                scope.closeModal     = closeModal;
                scope.link           = link;
                scope.share          = Share.share;

                function init() {
                    scope.form       = Auth.getLoggedUser();
                    scope.formFields = UserForm.profile;
                    scope.languages  = AppConfig.locales;
                    scope.language   = $translate.use();
                }

                function openModal() {

                    init();
                    $ionicModal.fromTemplateUrl('app/directive/settings-modal.html', {
                        scope: scope
                    }).then(function (modal) {
                        scope.modal = modal;
                        scope.modal.show();
                    });
                }

                function link(sref) {
                    $state.go(sref);
                    scope.closeModal();
                }

                function submitUpdateProfile(form) {
                    var dataForm = angular.copy(form);
                    User.update(dataForm).then(function (resp) {
                        console.log(resp);
                        init();
                        scope.closeModal();
                    });
                }

                function closeModal() {
                    scope.modal.hide();
                    scope.modal.remove();
                }

            }
        };
    }


})();
