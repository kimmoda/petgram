'use strict';
angular
    .module ('module.card')
    .controller ('CardHomeCtrl', function ($scope, Card) {

    $scope.cards = [];


    $scope.addCard = function (img, name) {
        var newCard = {image: img, name: name};
        newCard.id  = Math.random ();
        $scope.cards.unshift (angular.extend ({}, newCard));
    };

    $scope.addCards = function (count) {
        //$http.get ('http://api.randomuser.me/?results=' + count).then (function (value) {
        //    angular.forEach (value.data.results, function (v) {
        //        $scope.addCard (v.user.picture.large, v.user.name.first + " " + v.user.name.last);
        //    });
        //});

        Card
            .all ()
            .then (function (resp) {
            console.log (resp);
            angular.forEach (resp, function (item) {
                $scope.addCard (item.image, item.name);
            });
        })
    };

    $scope.addFirstCards = function () {
        $scope.addCard ("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/left.png", "Nope");
        $scope.addCard ("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/right.png", "Yes");
    };
    //
    //$scope.addFirstCards ();
    $scope.addCards (1);

    $scope.cardDestroyed = function (index) {
        $scope.cards.splice (index, 1);
        $scope.addCards (1);
    };

    $scope.transitionOut = function (card) {
        console.log ('card transition out');
    };

    $scope.transitionRight = function (card) {
        console.log ('card removed to the right');
        Card
            .like (card)
            .then (function (resp) {
            console.log (resp);
        });
    };

    $scope.transitionLeft = function (card) {
        console.log ('card removed to the left');
        Card
            .not (card)
            .then (function (resp) {
            console.log (resp);
        });
    };

})