//https://github.com/mhartington/ion-md-textarea
'use strict';
angular
    .module ('ion-form')
    .directive ('ionMdTextarea', function () {
    return {
        restrict: 'E',
        replace : true,
        require : '?ngModel',
        template: '<label class="item item-textarea item-md-label">' +
        '<textarea class="msd-elastic"></textarea>' +
        '<span class="input-label"></span>' +
        '<div class="hightlight"></div>' +
        '<i class="">' +
        '</label>',
        compile : function (element, attr) {

            // Line Color
            var hightlight = element[0].querySelector ('.hightlight');
            var hightlightColor;
            console.log (hightlight);

            if (!attr.hightlightColor) {
                hightlightColor = 'calm';
            } else {
                hightlightColor = attr.hightlightColor;
            }

            hightlight.className += ' hightlight-' + hightlightColor;

            // Label
            var label = element.find ('span');
            label.html (attr.placeholder);

            // textarea Active
            var textarea = element.find ('textarea');
            textarea.bind ('blur', function () {
                if (textarea.val ())
                    textarea.addClass ('used');
                else
                    textarea.removeClass ('used');
            });
            angular.forEach ({
                'name'        : attr.name,
                'type'        : attr.type,
                'ng-value'    : attr.ngValue,
                'ng-model'    : attr.ngModel,
                'required'    : attr.required,
                'ng-required' : attr.ngRequired,
                'ng-minlength': attr.ngMinlength,
                'ng-maxlength': attr.ngMaxlength,
                'ng-pattern'  : attr.ngPattern,
                'ng-change'   : attr.ngChange,
                'ng-trim'     : attr.trim,
                'ng-blur'     : attr.ngBlur,
                'ng-focus'    : attr.ngFocus
            }, function (value, name) {
                if (angular.isDefined (value)) {
                    textarea.attr (name, value);
                }
            });
            var cleanUp  = function () {
                ionic.off ('$destroy', cleanUp, element[0]);
            };
            ionic.on ('$destroy', cleanUp, element[0]);
        }
    };
});