'use strict';
angular
    .module ('module.stube')
    .config (function ($stateProvider, $urlRouterProvider) {

    $stateProvider

        .state ('app.stubeIntro', {
        url        : '/intro',
        title      : 'Intro',
        templateUrl: 'module/stube/view/stube.intro.html'
    })

        .state ('app.stubeLocker', {
        url  : '/locker',
        title: 'Locker',
        views: {
            menuContent: {
                controller : 'LockerCtrl as Locker',
                templateUrl: 'module/stube/view/stube.locker.html'
            }
        }
    })


        // Tabs
        .state ('app.stube', {
        url     : '/stube',
        abstract: true,
        views   : {
            menuContent: {
                controller : 'TabsCtrl as Tabs',
                templateUrl: 'module/stube/view/stube.tabs.html'
            }
        }
    })

        // Lista de Grupos
        .state ('app.stube.search', {
        url  : '/search',
        title: 'Busca',
        views: {
            tabSearch: {
                templateUrl: 'module/stube/view/stube.search.html',
                controller : 'RedtubeSearchCtrl as Search'
            }
        }
    })


        // Favoritos
        .state ('app.stube.favorites', {
        url  : '/favorites',
        title: 'Favoritos',
        views: {
            tabFavority: {
                templateUrl: 'module/stube/view/stube.favorites.html',
                controller : 'FavorityCtrl as Favority'
            }
        }
    })

        // Histórico
        .state ('app.stube.history', {
        url  : '/history',
        title: 'Histórico',
        views: {
            tabHistory: {
                templateUrl: 'module/stube/view/stube.history.html',
                controller : 'HistoryCtrl as History'
            }
        }
    })

        // Concifugrações
        .state ('app.stube.settings', {
        url  : '/settings',
        title: 'Configurações',
        views: {
            tabSettings: {
                templateUrl: 'module/stube/view/stube.settings.html',
                controller : 'SettingsCtrl as Settings'
            }
        }
    });

    //$urlRouterProvider.otherwise ('/locker');
});