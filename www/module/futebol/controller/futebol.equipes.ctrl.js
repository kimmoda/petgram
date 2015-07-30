'use strict';
angular
    .module ('module.futebol')
    .controller ('FutebolEquipesCtrl', function (Futebits) {
    var self = this;

    Futebits
        .getIdentificadorEquipes ()
        .then (function (resp) {
        self.data = resp;
        console.log (resp);
    });
});