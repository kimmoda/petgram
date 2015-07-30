'use strict';
angular
    .module ('module.futebol')
    .config (function ($stateProvider) {
    $stateProvider

        .state ('app.equipes', {
        url  : '/times',
        views: {
            menuContent: {
                controller : 'FutebolEquipesCtrl as FutebolEquipes',
                templateUrl: 'module/futebol/view/futebol.equipes.html'
            }
        }
    })

        .state ('app.futebol', {
        url     : '/futebol',
        abstract: true,
        views   : {
            menuContent: {
                templateUrl: 'module/futebol/view/futebol.tab.html'
            }
        }
    })

        .state ('app.futebol.jogos', {
        url  : '/jogos/:id',
        views: {
            tabJogos: {
                controller : 'FutebolEquipeJogosCtrl as FutebolEquipeJogos',
                templateUrl: 'module/futebol/view/futebol.jogos.html'
            }
        }
    })
    ;
});