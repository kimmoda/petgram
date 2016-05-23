(function () {
    'use strict';
    angular
        .module('app.photogram', [
            'ionic',
            'ngCordova',
            'app.account',
            'app.activity',
            'app.direct',
            'app.direct-message',
            'app.share',
            'app.home',
            'app.search'
        ])
        .config(configRoutes);

    var path = 'app/module/photogram';

    function configRoutes($stateProvider, $translatePartialLoaderProvider) {

        // Translation
        $translatePartialLoaderProvider.addPart(path);

        $stateProvider
            .state('photogram', {
                url: '/photogram',
                abstract: true,
                controller: 'PhotogramTabsCtrl',
                controllerAs: 'vm',
                templateUrl: path + '/module/tabs/photogram-tabs.html'
            });


    }
})();