(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name openTerms
     *
     * @description
     * https://github.com/initialxy/cordova-plugin-themeablebrowser
     *
     * @restrict A
     * */

    angular
        .module('ion-href', [])
        .directive('href', openTermsDirective);

    function openTermsDirective($cordovaInAppBrowser) {
        return {
            restrict: 'A',
            template: '',
            link: function (scope, elem, attr) {

                elem.bind('click', openModal);

                function openModal() {
                    var href = attr.href;

                    if (window.cordova) {
                        // Keep in mind that you must add your own images to native resource.
                        // Images below are for sample only. They are not imported by this plugin.
                        window.cordova.ThemeableBrowser.open(href, '_blank', {
                            statusbar: {
                                color: '#ffffffff'
                            },
                            toolbar: {
                                height: 44,
                                color: '#f0f0f0ff'
                            },
                            title: {
                                color: '#000',
                                showPageTitle: true
                            },
                            backButtonCanClose: true
                        })
                        ;
                    } else {
                        window.open(href);
                    }

                    return false;
                }
            }
        }
    }

})();