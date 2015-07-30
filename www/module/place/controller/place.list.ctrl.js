'use strict';
angular
    .module ('module.place')
    .controller ('PlaceListCtrl', function (User, Place) {
    var self = this;

    self.data = [];
    self.map  = {
        center     : {
            latitude : -23.5333333,
            longitude: -46.6166667
        },
        scrollwheel: false,
        zoom       : 13
    };

    Place
        .data ()
        .then (function (resp) {
        console.log (resp);
        angular.forEach (resp, function (item) {
            self.data.push (item);
        });
    });

    User
        .location ()
        .then (function (pos) {
        console.log (pos);
        self.map = {
            center     : {
                latitude : pos.coords.latitude,
                longitude: pos.coords.longitude
            },
            scrollwheel: false,
            zoom       : 13
        };

        //self.data.push (
        //    {
        //        id    : 0,
        //        title : 'Restaurante',
        //        icon  : 'img/tyrion.jpg',
        //        events: '',
        //        coords: pos.coords
        //    }
        //);

    });

});