'use strict';
angular
    .module ('module.place')
    .factory ('Place', function ($q) {

        var data = [
            {id: 0, title: 'Padaria', img: 'img/arya.jpg', rating: 3, desc: 'asdf asdf asdfsa asdfsad fsadfasdf asdfsadfasd f'},
            {id: 2, title: 'Lanchonete', img: 'img/crown.jpg', rating: 4, desc: 'asdf asdf asdfsa asdfsad fsadfasdf asdfsadfasd f'},
            {id: 3, title: 'Restaurante', img: 'img/daenerys.jpg', rating: 2, desc: 'asdf asdf asdfsa asdfsad fsadfasdf asdfsadfasd f'},
            {id: 4, title: 'Restaurante', img: 'img/jon-snow.jpg', desc: 'asdf asdf asdfsa asdfsad fsadfasdf asdfsadfasd f'},
            {id: 5, title: 'Restaurante', img: 'img/sansa.jpg', desc: 'asdf asdf asdfsa asdfsad fsadfasdf asdfsadfasd f'},
            {id: 6, title: 'Restaurante', img: 'img/tyrion.jpg', desc: 'asdf asdf asdfsa asdfsad fsadfasdf asdfsadfasd f'}
        ];

        function getData () {
            var defer = $q.defer ();
            defer.resolve (data);
            return defer.promise;

        }

        return {
            data: getData
        };

    }
);  