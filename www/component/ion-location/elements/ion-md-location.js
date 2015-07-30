//https://github.com/mhartington/ion-md-input
'use strict';
angular
    .module ('ion-location')
    .directive ('ionMdLocation', function () {
    return {
        restrict: 'E',
        replace : true,
        require : '?ngModel',
        template: '<label class="item item-input item-md-label">' +
        '<input type="text">' +
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

            // Icon
            var icon = element[0].querySelector ('i');
            if (attr.icon) {
                icon.className += 'icon ' + attr.icon;
            }
            ;

            hightlight.className += ' hightlight-' + hightlightColor;

            // Label
            var label = element.find ('span');
            label.html (attr.placeholder);

            // Input Active
            var input   = element.find ('input');
            input.bind ('blur', function () {
                if (input.val ()) {
                    input.addClass ('used');
                } else {
                    input.removeClass ('used');
                }
            });
            angular.forEach ({
                'name'               : attr.name,
                'type'               : attr.type,
                'ng-value'           : attr.ngValue,
                'ng-model'           : attr.ngModel,
                'required'           : attr.required,
                'location-suggestion': attr.locationSuggestion,
                'location'           : attr.location,
                'ng-required'        : attr.ngRequired,
                'ng-minlength'       : attr.ngMinlength,
                'ng-maxlength'       : attr.ngMaxlength,
                'ng-pattern'         : attr.ngPattern,
                'ng-change'          : attr.ngChange,
                'ng-trim'            : attr.trim,
                'ng-blur'            : attr.ngBlur,
                'ng-focus'           : attr.ngFocus
            }, function (value, name) {
                if (angular.isDefined (value)) {
                    input.attr (name, value);
                }
            });
            var cleanUp = function () {
                ionic.off ('$destroy', cleanUp, element[0]);
            };
            ionic.on ('$destroy', cleanUp, element[0]);
        }
    };
});