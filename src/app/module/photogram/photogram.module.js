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

    function configRoutes($stateProvider, $translatePartialLoaderProvider) {

        $stateProvider
            .state('photogram', {
                url: '/photogram',
                abstract: true,
                controller: 'PhotogramTabsCtrl',
                controllerAs: 'vm',
                templateUrl: 'app/module/photogram/module/tabs/photogram-tabs.html',
                resolve: {
                    init: function  (DAO, $q, User, PhotogramSetting, AppConfig) {
                        var defer = $q.defer();
                        DAO.init(AppConfig.DAO).then(function  (start) {
                            var promises = [
                                PhotogramSetting.init(),
                            ];
                            $q.all(promises).then(function  (data) {
                                console.log(data);
                                defer.resolve(data);
                            });
                        });
                        return defer.promise;
                    }
                }
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/module/photogram');

    }
})();
