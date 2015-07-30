'use strict';
angular
    .module ('module.alimento')
    .controller ('GrupoAlimentoCtrl', function (GrupoAlimento) {
    var self = this;

    self.data = [];

    GrupoAlimento
        .data ()
        .then (function (resp) {
        self.data = resp;
    });

});
