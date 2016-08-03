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
                scope.share = Share.share;

                scope.logout = function () {
                    $state.go(AppConfig.routes.login);
                    scope.closeSettingModal();
                };

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
                        scope.modalSetting = modal;
                        scope.modalSetting.show();

                    });

                    scope.closeSettingModal = function () {
                        scope.modalSetting.hide();
                        scope.modalSetting.remove();
                    };

                    scope.link       = function (sref) {
                        $state.go(sref);
                        scope.closeModal();
                    };
                }


            }
        };
    }


})();
