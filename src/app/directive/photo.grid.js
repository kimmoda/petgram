(function () {
    'use strict';

    angular.module('starter').directive('photoGrid', photoGridDirective);

    function photoGridDirective(Gallery, $rootScope, $ionicPopup, Share, FeedbackModal, $ionicActionSheet) {

        return {
            restrict   : 'E',
            scope      : {
                username: '=',
                user    : '=',
                profile : '=',
                onReload  : '=',
            },
            templateUrl: 'app/directive/photoGridDirective.html',
            link       : photoGridCtrl
        };

        function photoGridCtrl($scope, elem, attr) {
            $scope.params      = {};
            $scope.params.page = 1;
            $scope.data        = [];

            if ($scope.username) {
                $scope.params.username = $scope.username;
            }

            $scope.loading = true;

            $rootScope.$on('photoInclude', function (elem, item) {
                if (item.objectId) {
                    item.id = item.objectId;
                }
                $scope.data.unshift(item);
            });


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

                Gallery.feed($scope.params).then(function (data) {
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
                showLoading();
                loadFeed();
                $scope.$broadcast('scroll.refreshComplete');
            };

            $scope.action = function (gallery) {

                var buttons = [{
                    text: '<i class="icon ion-share"></i>' + ('Share')
                }, {
                    text: '<i class="icon ion-alert-circled"></i>' + ('Report')
                }];


                console.log(gallery);

                if (Parse.User.current().id === gallery.user_id) {
                    var buttonDelete = {
                        text: '<i class="icon ion-trash-b"></i>' + ('Delete your photo')
                    };
                    buttons.push(buttonDelete);
                }
                var message = {
                    text : gallery.title,
                    image: gallery.img
                };

                var actionSheet = {
                    buttons      : buttons,
                    titleText    : ('Photo'),
                    cancelText   : ('Cancel'),
                    buttonClicked: actionButtons
                };


                function actionButtons(index) {
                    switch (index) {
                        case 0:
                            Share.share(message);
                            break;
                        case 1:
                            FeedbackModal.modal(gallery);
                            break;
                        case 2:

                            $ionicPopup
                                .confirm({
                                    title   : ('Delete photo'),
                                    template: ('Are you sure?')
                                })
                                .then(function (res) {
                                    if (res) {
                                        Gallery.destroy(gallery).then(function () {
                                            console.log('Photo deleted');
                                            $scope.$emit('PhotogramHome:reload');
                                        });
                                    }
                                });


                    }
                    return true;
                }

                // Show the action sheet
                $ionicActionSheet.show(actionSheet);
            };

        }

    }


})();
