(function () {
    'use strict';
    angular
        .module('app.activity', [])
        .config(configRoutes);


    function configRoutes($stateProvider, $translatePartialLoaderProvider) {

    var path = 'app/module/photogram/module/activity';
        //$translatePartialLoaderProvider.addPart(path);

        $stateProvider
            .state('photogram.activity', {
                url: '/activity',
                views: {
                    tabActivity: {
                        controller: 'PhotogramActivityCtrl',
                        controllerAs: 'vm',
                        templateUrl: path + '/activity.html'
                    }
                }
            })

        ;
    }
})();
