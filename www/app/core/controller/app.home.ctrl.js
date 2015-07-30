'use strict';
angular
    .module ('module.core')
    .controller ('HomeCtrl', function ($rootScope, $state, DashboardSlide, Place) {
    var self = this;
    if (!$rootScope.isLoggedIn) {
        $state.go ('app.home');
    }

    DashboardSlide
        .all ()
        .then (function (resp) {
        self.slideshow = resp;
    });


    self.menu = [{
        title: 'Corte de Cabelo',
        path : 'articles',
        icon : 'ion-speakerphone'
    }, {
        title: 'Estilo',
        path : 'products',
        icon : 'ion-bag'
    }, {
        title: 'Barbearia',
        path : 'galleries',
        icon : 'ion-images'
    }, {
        title: 'Pintura',
        path : 'map',
        icon : 'ion-map'
    }, {
        title: 'Unhas',
        path : 'map',
        icon : 'ion-map'
    }, {
        title: 'Maquiagem',
        path : 'map',
        icon : 'ion-map'
    }, {
        title: 'Pintura',
        path : 'map',
        icon : 'ion-map'
    }, {
        title: 'Massagem',
        path : 'map',
        icon : 'ion-map'
    }, {
        title: 'Relaxamento',
        path : 'map',
        icon : 'ion-map'
    }, {
        title: 'Limpeza de Pele',
        path : 'map',
        icon : 'ion-map'
    }, {
        title: 'Relaxamento',
        path : 'map',
        icon : 'ion-map'
    }
    ];

});
