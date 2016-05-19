(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name modalLanguage
     *
     * @description
     * _Please update the description and restriction._
     *
     * @restrict A
     * */

    var path = 'app/module/photogram/directives/modal-language';

    angular
        .module('app.photogram')
        .directive('modalLanguage', modalLanguageDirective);

    function modalLanguageDirective(AppConfig, $translate, $timeout, Loading, $ionicModal) {
        return {
            restrict: 'A',
            link: modalLanguageLink,
            template: ''
        };

        function modalLanguageLink(scope, elem, attr) {
            elem.bind('click', openModal);

            function openModal() {

                scope.closeModal = function () {
                    scope.modal.hide();
                    // scope.modal.remove();
                };

                scope.languages = AppConfig.locales;
                scope.searchValue = '';

                scope.selectLanguage = function (language) {
                    console.log(language);
                    $translate.use(language.code);
                    moment.locale(language.code);
                    Loading.start();
                    scope.closeModal();
                    $timeout(function () {
                        Loading.end();
                    }, 1000);
                };

                $ionicModal
                    .fromTemplateUrl(path + '/modal-language.html', {
                        scope: scope,
                        focusFirstInput: true
                    })
                    .then(function (modal) {
                        scope.modal = modal;
                        scope.modal.show();

                    });
            }
        }
    }

})();