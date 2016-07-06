(function () {
    'use strict';

    angular.module('starter').controller('GalleryComment', GalleryCommentController);

    function GalleryCommentController($scope, $stateParams, $q, $ionicScrollDelegate, $ionicHistory, Loading, $ionicPopup, User, Dialog, $timeout, Gallery, GalleryComment, GalleryForm) {

        $scope.currentUser = Parse.User.current();
        $scope.loading     = true;
        $scope.formFields  = GalleryForm.formComment;

        function init() {
            $scope.nocomments = false;
            $scope.loading    = false;
            Gallery.get($stateParams.galleryId).then(function (gallery) {
                $scope.form = {
                    gallery: gallery,
                    text   : ''
                };
            });
        }

        $scope.backButton = function () {
            $ionicHistory.goBack();
        };

        getComments();
        init();

        //Mentios
        // shows the use of dynamic values in mentio-id and mentio-for to link elements
        $scope.myIndexValue = "5";

        $scope.searchPeople = function (term) {
            var peopleList = [];
            return User.getFollowing().then(function (response) {
                _.each(response, function (item) {
                    item.imageUrl = item.photo ? item.photo._url : 'img/user.png';
                    item.bio      = item.status;

                    if (item.name) {
                        if (item.name.toUpperCase().indexOf(term.toUpperCase()) >= 0) {
                            peopleList.push(item);
                        }
                    } else {
                        item.name = 'Not name';
                        peopleList.push(item);
                    }
                });
                $scope.people = peopleList;
                console.log(peopleList);
                return $q.when(peopleList);
            });
        };

        $scope.getPeopleTextRaw = function (item) {
            return '@' + item.username;
        };


        $scope.deleteComment = function (obj) {
            console.log(obj);
            Dialog.confirm(('Delete comment'), ('You are sure?')).then(function (resp) {
                console.log(resp);
                if (resp) {
                    GalleryComment.destroy(obj).then(function (resp) {
                        console.log(resp);
                        getComments();
                    });
                }
            });
        }

        $scope.editComment = function (obj) {
            console.log(obj);
            // An elaborate, custom popup
            $scope.data = angular.copy(obj);
            $ionicPopup
                .show({
                    template: '<input type="text" ng-model="data.text">',
                    title   : ('Edit comment'),
                    //subTitle: 'Please use normal things',
                    scope   : scope,
                    buttons : [{
                        text: ('Cancel')
                    }, {
                        text : '<b>OK</b>',
                        type : 'button-positive',
                        onTap: function (e) {
                            console.log($scope.data);
                            if (!$scope.data.text) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                return $scope.data;
                            }
                        }
                    }]
                })
                .then(function (resp) {
                    console.log(resp);
                    if (resp) {
                        GalleryComment.update(resp)
                                      .then(function (resp) {
                                          console.log(resp);
                                          getComments();
                                      });
                    }
                });
        }

        function getComments() {
            $scope.loading = true;
            Gallery.comments({galleryId: $stateParams.galleryId}).then(function (resp) {
                $scope.comments = [];

                resp.map(function (comment) {
                    console.log(comment);
                    comment.canEdit = (comment.user.obj.id === $scope.currentUser.id) ? true : false;
                    $scope.comments.push(comment);
                });

                $scope.loading = false;
                $ionicScrollDelegate.scrollBottom();
            });
        }

        $scope.submitComment = function (rForm, form) {
            if (rForm.$valid) {
                var dataForm   = angular.copy(form);
                $scope.loading = true;
                GalleryComment.create(dataForm).then(function (resp) {
                    getComments();
                    $scope.form.text = '';
                });
            }
        }


    }

})();
