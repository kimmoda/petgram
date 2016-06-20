(function () {
    'use strict';

    angular
        .module('app.main')
        .controller('SearchCtrl', SearchCtrl);

    function SearchCtrl($scope, $filter, $ionicLoading, $state) {


        $scope.onSearch = function () {

            if ($scope.params.search !== '') {
                $scope.params.page   = 0;
                $scope.places        = [];
                $scope.params.search = $filter('lowercase')($scope.params.search);
            }
        };


    }


})();
