(function () {
    'use strict';
    angular
        .module('app.photogram')
        .directive('photogramPhotoList', photogramPhotoList);

    function photogramPhotoList(AppConfig, Photogram, $ionicPopup, PhotogramShare, PhotogramFeedback, $ionicActionSheet) {
        var path = AppConfig.path;

        return {
            restrict: 'E',
            scope: {
                user: '=',
                profile: '='
            },
            templateUrl: path + '/directive/photolist/photo.list.html',
            link: photogramPhotoListCtrl
        };

        function photogramPhotoListCtrl($scope, elem, attr) {

            $scope.action  = action;
            $scope.like    = likePhoto;
            $scope.loading = true;
            $scope.load    = feed;
            $scope.load();
            $scope.loadMore = loadMore;
            $scope.gallery = {
                src: ''
            };

            console.log('user',$scope.user);


            init();

            $scope.$on('PhotogramHome:reload', function () {
                loadMore(true);
            });

            function init() {
                $scope.data  = {
                    total: -1,
                    galleries: []
                };
                $scope.page  = 0;
                $scope.empty = false;
                $scope.more  = false;
            }


            function loadMore(force) {
                console.log('Load More', $scope.more);
                $scope.load(force);
            }


            function feed(force) {
                // console.log('Load ');

                if (force) {
                    init();
                }

                Photogram
                    .feed($scope.page, $scope.user)
                    .then(function (resp) {

                        console.log(resp);
                        resp.rows.map(function (item) {
                            item.progress     = false;
                            // console.table(item);
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
                        //delete gallery.item.likeProgress;
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