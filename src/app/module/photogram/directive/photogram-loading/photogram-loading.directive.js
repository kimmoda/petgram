(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name PhotogramLoading
     *
     * @description
     * _Please update the description and restriction._
     *
     * @restrict E
     * */

    angular
        .module('app.photogram')
        .directive('photogramLoading', PhotogramLoadingDirective);

    function PhotogramLoadingDirective() {
        return {
            restrict: 'E',
            scope: {
                loading: '=',
                icon: '@'
            },
            template: '<div class="padding text-center loading" ng-show="loading"><ion-spinner icon="{{ icon }}"></ion-spinner></div>'
        };
    }

})();