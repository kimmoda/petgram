'use strict';
angular
    .module ('module.stube')
    .directive ('stubeCard', function () {
    return {
        restrict   : 'E',
        replace    : true,
        scope      : {
            videos: '='
        },
        templateUrl: 'module/stube/view/partials/stube.card.html'
    };
});