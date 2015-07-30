'use strict';
angular
    .module ('module.place')
    .config (function ($stateProvider) {
    $stateProvider

        .state ('app.place', {
        url     : '/places',
        abstract: true,
        views   : {
            menuContent: {
                templateUrl: 'module/place/view/place.tab.html'
            }
        }
    })

        .state ('app.place.list', {
        url  : '/list',
        views: {
            tabHome: {
                templateUrl: 'module/place/view/place.list.html',
                controller : 'PlaceListCtrl as PlaceList'
            }
        }
    })

        .state ('app.place.place', {
        url  : '/place/:id',
        views: {
            tabHome: {
                controller : 'PlaceDetailCtrl as Place',
                templateUrl: 'module/place/view/place.detail.html'
            }
        }
    })

        .state ('app.place.map', {
        url  : '/map',
        views: {
            tabMap: {
                controller : 'PlaceMapCtrl as PlaceMap',
                templateUrl: 'module/place/view/place.map.html'
            }
        }
    })

})
;

