'use strict';
angular
    .module ('module.alimento')
    .factory ('Alimento', function ($http, $q) {

        var _data = _Alimento;

        function data () {
            var defer = $q.defer ();
            defer.resolve (_data);
            return defer.promise;
        }

        function get (id) {
            var defer = $q.defer ();

            var alimentos = _data.filter (function (item) {
                return item.grupoalimento_id === id;
            });

            var retorno = [];

            angular.forEach (alimentos, function (obj) {
                obj.img = _Midia.filter (function (item) {
                    return parseInt (obj.icone) == parseInt (item._id);
                })[0];
                retorno.push (obj);
            });

            defer.resolve (retorno);

            return defer.promise;
        }

        return {
            data: data,
            get : get
        };

    }
);
