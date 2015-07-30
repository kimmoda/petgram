//https://github.com/mhartington/ion-md-input
'use strict';
angular
    .module ('ion-form')
    .directive ('ionMdRadio', function () {
    return {
        restrict: 'E',
        replace : true,
        require : '?ngModel',
        scope   : {
            title: '=',
            array: '@'
        },
        template: '<div class="list">' +
        '<label class="item item-input item-divider">{{ title }}</label>' +
        '<label class="item item-radio">' +
        '<input type="radio" name="group">' +
        '<div class="item-content">Go</div>' +
        '<i class="radio-icon ion-checkmark"></i>' +
        '</label>' +
        '<div>',
        compile : function (element, attr) {

            // Line Color


            var cleanUp = function () {
                ionic.off ('$destroy', cleanUp, element[0]);
            };
            ionic.on ('$destroy', cleanUp, element[0]);
        }
    };
});