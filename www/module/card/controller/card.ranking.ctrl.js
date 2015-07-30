'use strict';
angular
    .module ('module.card')
    .controller ('CardRankingCtrl', function (Card) {
    var self = this;

    Card
        .all ()
        .then (function (resp) {
        self.data = resp;
    });
});