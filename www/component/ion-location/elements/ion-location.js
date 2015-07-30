'use strict';
angular
    .module ('ion-location')
    .directive ('ionLocation', function ($ionicModal, GeoService) {
    return {
        restrict: 'A',
        scope   : {
            location: '='
        },
        link    : function ($scope, element) {
            $scope.location = {};

            var init = function () {
                $scope.search             = {};
                $scope.search.suggestions = [];
                $scope.search.query       = '';
            };

            $scope.modal = $ionicModal.fromTemplate ('<ion-modal-view>' +
                '<ion-header-bar class="item-input-inset">' +
                '<button class="button button-clear button-icon ion-pinpoint" ng-click="findMe()"></button>' +
                '<label class="item-input-wrapper">' +
                '<input type="search" ng-model="search.query" placeholder="Search"></label>' +
                '<button class="button button-clear button-icon ion-ios-close-empty" ng-click="close()"></button>' +
                '</ion-header-bar>' +
                '<ion-content padding="false">' +
                '<ion-list>' +
                '<ion-item ng-repeat="suggestion in search.suggestions" ng-click="choosePlace(suggestion)" ng-bind="suggestion.description"></ion-item>' +
                '<ion-item class="item-divider"><img src="https://developers.google.com/maps/documentation/places/images/powered-by-google-on-white.png"alt=""/></ion-item>' +
                '</ion-list>' +
                '</ion-content>' +
                '</ion-modal-view>', {
                    scope          : $scope,
                    focusFirstInput: true
                }
            );

            element[0].querySelector ('input').addEventListener ('focus', function () {
                init ();
                $scope.open ();
            });

            $scope.$watch ('search.query', function (newValue) {
                if (newValue) {
                    GeoService
                        .searchAddress (newValue)
                        .then (function (result) {
                        $scope.search.suggestions = result;
                    });
                }

                $scope.open = function () {
                    $scope.modal.show ();
                };

                $scope.close = function () {
                    $scope.modal.hide ();
                };

                $scope.findMye = function () {
                    GeoService
                        .searchAddress (newValue)
                        .then (function (result) {
                        $scope.search.suggestions = result;
                    });
                };

                $scope.choosePlace = function (place) {

                    GeoService
                        .getDetails (place.place_id)
                        .then (function (location) {

                        var address = GeoService
                            .parseAddress (location);

                        $scope.location.number   = address.number;
                        $scope.location.street   = address.street;
                        $scope.location.district = address.district;
                        $scope.location.city     = address.city;
                        $scope.location.state    = address.state;
                        $scope.location.country  = address.country;
                        $scope.location.zipcode  = address.zipcode
                        $scope.location.geo      = address.geo;
                        $scope.location.image    = address.image;
                        $scope.location.resume   = address.resume;


                        $scope.close ();
                    });

                };
            });
        }
    };
});