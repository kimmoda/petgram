'use strict';
angular
    .module ('module.alimento')
    .config (function ($stateProvider) {
    $stateProvider


        .state ('app.alimento', {
        url     : '/alimento/grupos',
        abstract: 'true',
        views   : {
            menuContent: {
                templateUrl: 'module/alimento/view/alimento.tab.html'
            }
        }
    })

        .state ('app.alimento.grupo', {
        url  : '/alimento/grupos',
        views: {
            tabAlimento: {
                controller : 'GrupoAlimentoCtrl as GrupoAlimento',
                templateUrl: 'module/alimento/view/grupos.list.html'
            }
        }
    })


})
;
