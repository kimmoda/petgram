(function () {
    'use strict';
    angular
        .module('app.photogram')
        .directive('photogramPhotoGrid', photogramPhotoGrid);

    function photogramPhotoGrid(AppConfig, Photogram, $ionicPopup, PhotogramShare, PhotogramFeedback, $ionicActionSheet) {
        var path = AppConfig.path;

        return {
            restrict: 'E',
            scope: {
                user: '=',
                profile: '='
            },
            templateUrl: path + '/directive/photogrid/photo-grid.html',
            link: photogramPhotoGridCtrl
        };

        function photogramPhotoGridCtrl($scope, elem, attr) {

            $scope.action  = action;
            $scope.like    = likePhoto;
            $scope.loading = true;
            $scope.feed    = feed;
            $scope.gallery = {
                src: ''
            };

            init();

            $scope.$on('PhotogramHome:reload', function () {
                feed(true);
            });

            function init() {
                $scope.data  = {
                    total: -1,
                    galleries: []
                };
                $scope.page  = 0;
                $scope.empty = false;
                $scope.more  = false;
                feed(false,true);
            }


            function feed(force, cache) {
                // console.log('Load ');

                if (force) {
                    init();
                }

                var service = Photogram.getOfflineFeed($scope.page, $scope.user);

                if (!cache) {
                    service = Photogram.feedGrid($scope.page, $scope.user)
                }

                service
                    .then(function (resp) {

                        console.log(resp);
                        resp.rows.map(function (item) {
                            item.progress     = false;
                            $scope.data.total = resp.total;
                            $scope.data.galleries.push(item);
                        });

                        // console.log('qtd', resp.length);

                        if (resp.length) {
                            $scope.more = true;
                            $scope.page++;
                        } else {
                            $scope.empty = true;
                            $scope.more  = false;
                        }
                    })
                    .then(function () {
                        $scope.loading = false;
                        $scope.$broadcast('scroll.refreshComplete');
                        $scope.$broadcast('scroll.infiniteScrollComplete');

                    })
                    .catch(function () {
                        $scope.$broadcast('scroll.refreshComplete');
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        if ($scope.data.length) {
                            $scope.loading = false;
                            $scope.page++;
                        } else {
                            $scope.empty   = true;
                            $scope.loading = false;
                        }
                        $scope.more = false;
                    });
            }

            function likePhoto(gallery) {
                gallery.item.liked = !gallery.item.liked;
                Photogram
                    .likeGallery(gallery.id)
                    .then(function (resp) {
                        gallery.item.qtdLike = resp.likes;
                    });
            }

            function action(gallery) {

                var buttons = [{
                    text: '<i class="icon ion-share"></i>' + ('Share')
                }, {
                    text: '<i class="icon ion-alert-circled"></i>' + ('Report')
                }];

                var user = Parse.User.current();

                if (user.id === gallery.user.id) {
                    var buttonDelete = {
                        text: '<i class="icon ion-trash-b"></i>' + ('Delete your photo')
                    };
                    buttons.push(buttonDelete);
                }
                var message     = {
                    image: gallery.src,
                    text: gallery.item.title
                }
                var actionSheet = {
                    buttons: buttons,
                    titleText: ('Photo'),
                    cancelText: ('Cancel'),
                    buttonClicked: actionButtons
                };


                function actionButtons(index) {
                    switch (index) {
                        case 0:
                            PhotogramShare.share(message);
                            break;
                        case 1:
                            PhotogramFeedback.modal(gallery);
                            break;
                        case 2:

                            $ionicPopup
                                .confirm({
                                    title: ('Delete photo'),
                                    template: ('Are you sure?')
                                })
                                .then(function (res) {
                                    if (res) {
                                        Photogram
                                            .deletePhoto(gallery.id)
                                            .then(function () {
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
            }
        }

    }


})();