(function () {
    'use strict';

    angular.module('starter').controller('GalleryComment', GalleryCommentController);

    function GalleryCommentController($scope, $stateParams, $q, $ionicScrollDelegate, $ionicHistory, Loading, $ionicPopup, User, Dialog, $timeout, Gallery, GalleryComment) {

        $scope.currentUser = Parse.User.current();
        $scope.loading     = true;

        function init() {
            $scope.nocomments = false;
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


        $scope.deleteComment = function (item, index) {
            console.log(item);
            Dialog.confirm(('Delete comment'), ('You are sure?')).then(function (resp) {
                if (resp) {
                    GalleryComment.get(item.id).then(function (comment) {
                        GalleryComment.destroy(comment).then(function (resp) {
                            $scope.comments.splice(index, 1);
                        });
                    })
                }
            });
        }

        $scope.editComment = function (obj, index) {
            console.log(obj);
            // An elaborate, custom popup
            $scope.formEdit = {
                id  : obj.id,
                text: obj.text
            };

            $ionicPopup
                .show({
                    template: '<input type="text" ng-model="formEdit.text">',
                    title   : ('Edit comment'),
                    //subTitle: 'Please use normal things',
                    scope   : $scope,
                    buttons : [{
                        text: ('Cancel')
                    }, {
                        text : '<b>OK</b>',
                        type : 'button-positive',
                        onTap: function (e) {
                            console.log($scope.formEdit);
                            if (!$scope.formEdit.text) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                return $scope.formEdit;
                            }
                        }
                    }]
                })
                .then(function (resp) {
                    console.log(resp);
                    if (resp) {
                        GalleryComment.get(obj.id).then(function (comment) {
                            comment.text                = resp.text;
                            $scope.comments[index].text = resp.text;
                            comment.save();
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
