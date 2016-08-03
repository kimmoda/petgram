(function () {
    'use strict';
    angular.module('app.main').controller('ActivityCtrl', ActivityController);

    function ActivityController($scope, $rootScope,$state, GalleryActivity) {
        init();

        $scope.openProfile = function (username) {
            $state.go('tab.activityProfile', {username: username})
        };

        loadFeed();

        $rootScope.$emit('activity:clear', true);

        function loadFeed() {
            if ($scope.loading) return;
            $scope.loading = true;
            GalleryActivity.feed($scope.params).then(function (data) {
                console.log(data);
                if (data.length > 0) {
                    $scope.params.page++;
                    data.map(function (item) {
                        $scope.data.push(item);
                    });
                } else {
                    if ($scope.data.length === 0) {
                        $scope.showEmptyView = true;
                    }
                    $scope.moreDataCanBeLoaded = false;
                }

                $scope.loading = false;
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
                $rootScope.$broadcast('scroll.refreshComplete');

            }).catch(function (err) {
                if ($scope.data.length === 0) {
                    $scope.showErrorView = true;
                }
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

        $scope.onLoadMore = function () {
            loadFeed();
        };

        $scope.onReload = function () {
            init()
            loadFeed();
            $scope.$broadcast('scroll.refreshComplete');
        };

        function init() {
            $scope.params              = {};
            $scope.params.page         = 1;
            $scope.data                = [];
            $scope.moreDataCanBeLoaded = true;
            $scope.loading             = false;

            if ($scope.canEdit) {
                $scope.data.push({
                    create: true
                });
            }
        }

    }

})();
