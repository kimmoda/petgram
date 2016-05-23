(function () {
    'use strict';
    angular
        .module('app.search', [])
        .config(configRoutes);

    var path = 'app/module/photogram/module/search';

    function configRoutes($stateProvider) {
        $stateProvider
            .state('photogram.search', {
                url: '/search',
                views: {
                    tabsearch: {
                        controller: 'PhotogramSearchCtrl',
                        controllerAs: 'vm',
                        templateUrl: path + '/search.html'
                    }
                }
            });

    }
})();