(function () {
    'use strict';
    angular
        .module('app.account', [])
        .config(configRoutes);

    function configRoutes($stateProvider) {
        $stateProvider


            .state('photogram.account', {
                url: '/account',
                views: {
                    tabProfile: {
                        controller: 'PhotogramAccountCtrl',
                        controllerAs: 'vm',
                        templateUrl: 'app/module/photogram/module/account/account.html'
                    }
                }
            });
    }
})();
