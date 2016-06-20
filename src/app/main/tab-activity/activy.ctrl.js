(function () {
    'use strict';
    angular.module('app.main').controller('ActivityCtrl', ActivityController);

    function ActivityController($scope, GalleryActivity) {
        var vm         = this;
        vm.params      = {};
        vm.params.page = 1;
        vm.data        = [];

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
                vm.data.push(data[i]);
            }
        }

        function setCurrentPage(page) {
            vm.params.page = page;
        }

        function loadFeed() {

            GalleryActivity.feed(vm.params).then(function (data) {
                ensureMoreData(data.length);
                setCurrentPage(vm.params.page + 1);
                setGalleries(data);

                if (vm.data.length === 0) {
                    showEmptyView();
                } else {
                    showGalleries();
                }

                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.$broadcast('scroll.refreshComplete');

            }).catch(function () {
                if (vm.data.length === 0) {
                    showErrorView();
                }
                isMoreData = false;
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

        vm.onLoadMore = function () {
            loadFeed();
        };

        vm.moreDataCanBeLoaded = function () {
            return isMoreData;
        };

        vm.showLoadingView = function () {
            return isLoadingViewShown;
        };

        vm.showGalleries = function () {
            return isGalleriesViewShown;
        };

        vm.showErrorView = function () {
            return isErrorViewShown;
        };

        vm.showEmptyView = function () {
            return isEmptyViewShown;
        };

        vm.onReload = function () {
            vm.params.page = 0;
            vm.data        = [];
            showLoading();
            loadFeed();
            $scope.$broadcast('scroll.refreshComplete');
        };

    }

})();
