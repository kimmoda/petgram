'use strict';
angular
    .module ('module.card')
    .controller ('CardGraphCtrl', function (Card) {
    var self = this;

    self.labels = [];
    self.like   = [];
    self.not    = [];

    Card
        .all ()
        .then (function (resp) {

        angular.forEach (resp, function (item) {
            self.labels.push (item.name);
            self.like.push (item.like);
            self.not.push (item.not);
        });

    });
});