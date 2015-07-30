'use strict';
angular
    .module ('module.card')
    .config (function ($stateProvider) {
    $stateProvider

        .state ('app.card', {
        url     : '/card',
        abstract: true,
        views   : {
            menuContent: {
                templateUrl: 'module/card/view/card.tab.html'
            }
        }
    })

        .state ('app.card.home', {
        url  : '/home',
        views: {
            tabHome: {
                templateUrl: 'module/card/view/card.home.html',
                controller : 'CardHomeCtrl'
            }
        }
    })
        .state ('app.card.ranking', {
        url  : '/ranking',
        views: {
            tabRanking: {
                controller : 'CardRankingCtrl as CardRanking',
                templateUrl: 'module/card/view/card.ranking.html'
            }
        }
    })

        .state ('app.card.graph', {
        url  : '/graph',
        views: {
            tabGraph: {
                controller : 'CardGraphCtrl as CardGraph',
                templateUrl: 'module/card/view/card.graph.html'
            }
        }
    })

})
;

