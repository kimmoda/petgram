(function () {
    'use strict';

    angular.module('starter').controller('GalleryComment', GalleryCommentController);

    function GalleryCommentController($scope, $stateParams, $q, $ionicScrollDelegate, $ionicHistory, Loading, $ionicPopup, User, Dialog, $timeout, Gallery, GalleryComment, GalleryForm) {

        function init() {
            $scope.currentUser = Parse.User.current();
            $scope.nocomments  = false;
            $scope.loading     = false;
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

        init();

        $scope.loading       = true;
        $scope.formFields    = GalleryForm.formComment;
        $scope.submitComment = submitComment;
        $scope.deleteComment = deleteComment;
        $scope.editComment   = editComment;

        getComments();

        //Mentios
        // shows the use of dynamic values in mentio-id and mentio-for to link elements
        $scope.myIndexValue = "5";


        $scope.searchPeople = function (term) {
            var peopleList = [];
            return User.getFollowing().then(function (response) {
                _.each(response, function (item) {
                    item.imageUrl = item.photo ? item.photo._url : 'img/user.png';
                    item.bio      = item.status;
                    if (item.name.toUpperCase().indexOf(term.toUpperCase()) >= 0) {
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


        function deleteComment(obj) {
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

        function editComment(obj) {
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
                $scope.comments = resp;
                $scope.loading  = false;
                $ionicScrollDelegate.scrollBottom();
            });
        }

        function submitComment(rForm, form) {
            if (rForm.$valid) {
                var dataForm = angular.copy(form);
                console.log(dataForm);
                Loading.start();
                GalleryComment.create(dataForm).then(function (resp) {
                    console.log(resp);
                    getComments();
                    Loading.end();
                });
            }
        }


    }

})();
