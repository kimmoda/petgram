(function () {
    'use strict';

    angular.module('app.main').controller('SearchCtrl', SearchCtrl);

    function SearchCtrl($scope, $filter, Gallery, $rootScope) {


        $scope.onSearch = function () {
            var text             = $filter('lowercase')($scope.params.search);
            $scope.params.search = text;
            $scope.onReload();
        };

        $scope.params      = {};
        $scope.params.page = 1;
        $scope.params.text = '';
        $scope.data        = [];

        if ($scope.username) {
            $scope.params.username = $scope.username;
        }

        $scope.loading = true;

        loadFeed();

        var isLoadingViewShown   = false;
        var isGalleriesViewShown = false;
        var isErrorViewShown     = false;
        var isEmptyViewShown     = false;

        var isMoreData = false;

        function showLoading() {
            isLoadingViewShown   = true;
            isGalleriesViewShown = false;
            isErrorViewShown     = false;
            isEmptyViewShown     = false;
        }

        function showGalleries() {
            isGalleriesViewShown = true;
            isLoadingViewShown   = false;
            isErrorViewShown     = false;
            isEmptyViewShown     = false;
        }

        function showErrorView() {
            isErrorViewShown     = true;
            isGalleriesViewShown = false;
            isLoadingViewShown   = false;
            isEmptyViewShown     = false;
        }

        function showEmptyView() {
            isEmptyViewShown     = true;
            isErrorViewShown     = false;
            isGalleriesViewShown = false;
            isLoadingViewShown   = false;
        }


        function ensureMoreData(length) {
            isMoreData = false;
            if (length > 0) {
                isMoreData = true;
            }
        }

        function setGalleries(data) {
            for (var i = 0; i < data.length; i++) {
                $scope.data.push(data[i]);
            }
        }

        function setCurrentPage(page) {
            $scope.params.page = page;
        }

        function loadFeed() {

            Gallery.search($scope.params).then(function (data) {
                ensureMoreData(data.length);
                setCurrentPage($scope.params.page + 1);
                setGalleries(data);

                if ($scope.data.length === 0) {
                    showEmptyView();
                } else {
                    showGalleries();
                }

                $scope.loading = false;
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
                $rootScope.$broadcast('scroll.refreshComplete');

            }).catch(function () {
                if ($scope.data.length === 0) {
                    showErrorView();
                }
                isMoreData = false;
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

        $scope.onLoadMore = function () {
            loadFeed();
        };

        $scope.moreDataCanBeLoaded = function () {
            return isMoreData;
        };

        $scope.showLoadingView = function () {
            return isLoadingViewShown;
        };

        $scope.showGalleries = function () {
            return isGalleriesViewShown;
        };

        $scope.showErrorView = function () {
            return isErrorViewShown;
        };

        $scope.showEmptyView = function () {
            return isEmptyViewShown;
        };

        $scope.onReload = function () {
            $scope.params.page = 0;
            $scope.data        = [];
            $scope.loading     = true;
            showLoading();
            loadFeed();
            $scope.$broadcast('scroll.refreshComplete');
        };


    }


})();
