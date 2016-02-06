(function () {
    'use strict';
    angular
        .module('app.direct')
        .config(configRoutes);

    var path = 'app/module/photogram/module/direct/';

    function configRoutes($stateProvider, $translatePartialLoaderProvider) {

        // Translation
        //$translatePartialLoaderProvider.addPart(path);


        $stateProvider
        // Direct
            .state('photogram.direct', {
                url: '/direct',
                views: {
                    tabHome: {
                        controller: 'DirectHomeCtrl', controllerAs: 'vm',
                        templateUrl: path + '/view/direct.home.html'
                    }
                }
            })

            .state('photogram.message', {
                url: '/message/:channelId',
                views: {
                    tabHome: {
                        controller: 'DirectMessagesCtrl', controllerAs: 'vm',
                        templateUrl: path + '/view/direct.messages.html'
                    }
                }
            });
    }

})();
