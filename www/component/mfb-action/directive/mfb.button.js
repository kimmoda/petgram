'use strict';
angular.module ('mfb.directive')
    .directive ('mfbButton', function () {
    return {
        require   : '^mfbMenu',
        restrict  : 'EA',
        transclude: true,
        replace   : true,
        scope     : {
            icon : '@',
            image: '@',
            label: '@',
            class: '@'
        },
        template  : '<li>' +
        ' <a href="" data-mfb-label="{{label}}" class="mfb-component__button--child {{ class }}">' +
        '   <i class="mfb-component__child-icon {{icon}}"> </i>' +
        ' </a>' +
        '</li>'
    };
});