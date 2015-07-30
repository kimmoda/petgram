'use strict';
angular
    .module ('module.stube')
    .controller ('FavorityCtrl', function ($scope, Analytics, Stube) {

    Analytics.view ('Vídeos Favoritos');

    var self  = this;
    self.data = Stube.getData ();

    self.cleanFavority = function () {
        Stube.cleanFavority ();
    };

});