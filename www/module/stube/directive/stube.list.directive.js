'use strict';
angular
    .module ('module.stube')
    .directive ('stubeList', function (Stube) {
    return {
        restrict   : 'E',
        replace    : true,
        scope      : {
            videos: '=',
            type  : '@'
        },
        templateUrl: 'module/stube/view/partials/stube.list.html',
        link       : function ($scope) {

            console.log ($scope.type);

            $scope.remove = function (video) {
                if ($scope.type === 'favority') {
                    Stube.removeFavority (video);
                }

                if ($scope.type === 'history') {
                    Stube.removeHistory (video);
                }
            };

        }
    };
});