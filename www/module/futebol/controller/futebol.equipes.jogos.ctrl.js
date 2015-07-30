'use strict';
angular
    .module ('module.futebol')
    .controller ('FutebolEquipeJogosCtrl', function ($stateParams, Futebits) {
    var self = this;

    self.data = [];

    function getImage (array, size) {
        var result = '';
        angular.forEach (array, function (value, key) {
            if (key === size) {
                result = value;
            }
        });
        return result;
    }

    Futebits
        .getJogos ($stateParams.id)
        .then (function (resp) {
        angular.forEach (resp, function (item) {
            var obj = item;

            obj.escudo_equipe_mandante  = getImage (item.escudo_equipe_mandante, '200x200');
            obj.escudo_equipe_visitante = getImage (item.escudo_equipe_visitante, '200x200');

            console.log (obj);
            self.data.push (obj);
        });

    });
});