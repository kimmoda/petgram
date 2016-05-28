(function () {
    'use strict';
    angular
        .module('app.loading', [])
        .config(configRoutes);

    function configRoutes($stateProvider) {
        $stateProvider
            .state('router', {
                url: '/',
                templateUrl: 'app/module/loading/loading.html',
                controller: 'LoadingCtrl',
                controllerAs: 'vm'
            });
    }
})();