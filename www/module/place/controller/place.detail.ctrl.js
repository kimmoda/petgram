'use strict';
angular
    .module ('module.place')
    .controller ('PlaceDetailCtrl', function () {
        var self = this;

        self.data = {
            title  : 'Restaurante',
            desc   : ' asdf asdfas df asdfasdf',
            address: 'asdfasdfasfasdf sad asdf',
            photos : [{
                img: 'img/crown.jpg'
            }, {
                img: 'img/crown.jpg'
            }, {
                img: 'img/crown.jpg'
            }]
        };

    });
