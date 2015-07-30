'use strict';
angular
    .module ('module.player')
    .config (function ($stateProvider) {
    $stateProvider
        .state ('app.player', {
        url  : '/player',
        views: {
            menuContent: {
                controller : 'PlayerBrowseCtrl as PlayerBrowse',
                templateUrl: 'module/player/view/player.browse.html'
            }
        }
    })

    ;
});