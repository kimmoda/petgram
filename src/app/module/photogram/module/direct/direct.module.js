(function () {
    'use strict';
    angular
        .module('app.direct', [])
        .config(configRoutes);

    var path = 'app/module/photogram/module/direct';

    function configRoutes($stateProvider) {


        $stateProvider
        // Direct
            .state('photogram.direct', {
                url: '/direct',
                views: {
                    tabHome: {
                        controller: 'DirectHomeCtrl',
                        controllerAs: 'vm',
                        templateUrl: path + '/direct.home.html'
                    }
                }
            });
    }

})();