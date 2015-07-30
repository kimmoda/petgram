//https://github.com/mhartington/ion-md-input
'use strict';
angular
    .module ('ion-form')
    .directive ('ionMdEmail', function () {
    return {
        restrict: 'E',
        replace : false,
        require : '?ngModel',
        scope   : {
            placeholder: '@',
            bindModel  : '=ngModel'
        },
        template: '<label class="item item-input item-floating-label item-md-input">' +
        '<span class="input-label">{{ placeholder }}</span>' +
        '<input class="md-input" ng-model="bindModel" placeholder="{{ placeholder }}" type="email">' +
        '<div class="hightlight"></div>' +
        '</label>'
    };
});