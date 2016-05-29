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
                    tabSearch: {
                        controller: 'PhotogramSearchCtrl',
                        controllerAs: 'vm',
                        templateUrl: path + '/search.html'
                    }
                }
            })
            .state('photogram.search.map', {
                url: '/map',
                templateUrl: 'app/module/photogram/module/search-map/search-map.html',
                controller: 'SearchMapCtrl',
                controllerAs: 'vm'
            })
            .state('photogram.search.list', {
                url: '/list',
                templateUrl: 'app/module/photogram/module/search-list/search-list.html',
                controller: 'SearchListCtrl',
                controllerAs: 'vm'
            })
        ;

    }
})();