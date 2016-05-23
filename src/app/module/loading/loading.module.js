(function () {
    'use strict';
    angular
        .module('app.loading', [])
        .config(configRoutes);

    function configRoutes($stateProvider) {
        $stateProvider
            .state('router', {
                url: '/',
                template: '',
                controller: 'LoadingCtrl',
                controllerAs: 'vm'
            });
    }
})();