(function () {
    'use strict';
    angular
        .module('app.intro', [])
        .config(configRoutes);

    var path = 'app/module/intro';

    function configRoutes($stateProvider, $translatePartialLoaderProvider) {

        // Translation
        $translatePartialLoaderProvider.addPart(path);

        $stateProvider
            .state('intro', {
                url: '/intro',
                templateUrl: path + '/intro.html',
                controller: 'IntroCtrl',
                controllerAs: 'vm'
            });
    }
})();