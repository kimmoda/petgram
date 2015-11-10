(function (window, angular, Caman, undefined) {

    angular
        .module('ion-caman', [])
        .directive('caman', camanDirective)
        .factory('CamanJs', CamanJs);

    function camanDirective(CamanJs, $timeout) {
        return {
            restrict: 'A',
            scope: {
                filter: '=',
                name: '@'
            },
            link: camanDirectiveLink
        }

        function camanDirectiveLink($scope, elem, attr) {
            console.log($scope.filter, $scope.name)
            $timeout(function () {
                CamanJs.effect($scope.name, $scope.filter)
            }, 100);
        }
    }


    function CamanJs($q, $ionicLoading) {
        var filters = ['normal', 'vintage', 'lomo', 'clarity', 'sinCity', 'sunrise', 'crossProcess', 'orangePeel', 'love', 'grungy', 'jarques', 'pinhole', 'oldBoot', 'glowingSun', 'hazyDays', 'herMajesty', 'nostalgia', 'hemingway', 'concentrate'];

        return {
            filters: filters,
            effect: effect,
            reset: resetEffect
        }

        function effect(elem, effect, status) {
            var defer = $q.defer();
            var image = window.document.getElementById(elem);

            Caman(image, applyEffect);

            function applyEffect() {
                $ionicLoading.show();

                if(effect === 'normal') {
                    this.revert();
                    this.render(function () {
                        console.log('apply', elem, effect);
                        $ionicLoading.hide();
                        defer.resolve(effect);
                    });
                }

                if (effect in this) {
                    this[effect]();
                    if (status) resetEffect(elem);
                    this.render(function () {
                        console.log('apply', elem, effect);
                        $ionicLoading.hide();
                        defer.resolve(effect);
                    });
                }
            }

            return defer.promise;
        }

        function resetEffect(elem) {
            var image = window.document.getElementById(elem);
            Caman(image, resetCaman);
            function resetCaman() {
                this.revert();
            }
        }
    }

})(window, window.angular, window.Caman);