'use strict';
angular
    .module ('module.facebook')
    .directive ('facebookPhoto', function () {
    return {
        restrict: 'E',
        replace : 'true',
        scope   : {
            user  : '=',
            width : '=',
            height: '='
        },
        template: "<img ng-src=\"{{ 'https://graph.facebook.com/' + user + '/picture?width=' + width +'&height=' + height }}\"/>"
    }
});