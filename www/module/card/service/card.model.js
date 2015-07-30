'use strict';
angular
    .module ('module.card')
    .factory ('Card', function ($http, $q, Loading) {

    var data = {
        cards: []
    };

    function getCards () {
        var defer = $q.defer ();
        Loading.show ();

        new Parse
            .Query ('Card')
            //.descending ('name')
            .ascending ('name')
            .limit (10)
            .find ()
            .then (function (resp) {
            var objs = [];
            angular.forEach (resp, function (item) {
                var obj = {
                    id   : item.id,
                    name : item.attributes.name,
                    image: item.attributes.image._url,
                    like : item.attributes.like | 0,
                    not  : item.attributes.not | 0
                };

                objs.push (obj);
            });
            Loading.hide ();
            defer.resolve (objs);
        });

        return defer.promise;
    }

    function likeCard (card) {
        var defer = $q.defer ();

        Loading.show ();

        if (card.like === undefined) {
            card.like = 1;
        } else {
            card.like += 1;
        }

        var ParseClass = Parse.Object.extend ('Card');

        new Parse
            .Query (ParseClass)
            .get (card.id)
            .then (function (item) {
            item.set ('like', card.like);
            item.save ();
            Loading.hide ();
            defer.resolve (item, card);
        });

        return defer.promise;
    }

    function notCard (card) {
        var defer = $q.defer ();

        Loading.show ();
        if (card.not === undefined) {
            card.not = 1;
        } else {
            card.not += 1;
        }

        var ParseClass = Parse.Object.extend ('Card');

        new Parse
            .Query (ParseClass)
            .get (card.id)
            .then (function (item) {
            item.set ('not', card.not);
            item.save ();
            Loading.hide ();
            defer.resolve (item, card);
        });

        return defer.promise;
    }

    return {
        all : getCards,
        like: likeCard,
        not : notCard
    }

});