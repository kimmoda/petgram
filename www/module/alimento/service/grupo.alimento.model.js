'use strict';
angular
    .module ('module.alimento')
    .factory ('GrupoAlimento', function ($http, $q) {

        var _data = _GrupoAlimento;

        function data () {
            var defer = $q.defer ();
            defer.resolve (_data);
            return defer.promise;
        }

        function get (id) {
            console.log (id);
            var defer = $q.defer ();

            var grupo = _data.filter (function (item) {
                return item._id === id;
            });
            defer.resolve (grupo[0]);

            return defer.promise;
        }

        return {
            data: data,
            get : get
        };

    }
);
