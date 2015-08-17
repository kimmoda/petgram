(function () {
    'use strict';
    angular
        .module('module.core')
        .filter('rawHtml', function ($sce) {
            return function (val) {
                return $sce.trustAsHtml(val);
            };
        });
})();