(function () {
    'use strict';

    angular.module('starter').directive('photoComment', photoCommentDirective);

    function photoCommentDirective($ionicModal, $timeout, $q, $ionicScrollDelegate, Loading, $ionicPopup, User, Dialog, $rootScope, Gallery, GalleryComment) {

        return {
            restrict: 'A',
            scope   : {
                ngModel: '='
            },
            link    : function ($scope, elem) {


                elem.bind('click', openModalComment);

                function init() {
                    $scope.currentUser = Parse.User.current();
                    $scope.nocomments  = false;
                    $scope.loading     = false;
                    $scope.form        = {
                        gallery: $scope.ngModel.galleryObj,
                        text   : ''
                    };
                }

                function openModalComment() {
                    console.log($scope.ngModel);

                    init();

                    $scope.loading       = true;
                    $scope.submitComment = submitComment;
                    $scope.deleteComment = deleteComment;
                    $scope.editComment   = editComment;
                    $scope.closeModal    = function () {
                        $scope.modal.hide();
                        $scope.modal.remove();
                    };

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


                    //$scope.comments = $scope.ngModel.comments || [];
                    //$timeout(function () {
                    //    if ($scope.comments.length === 0) {
                    //        $scope.nocomments = true;
                    //    }
                    //}, 500);


                    $ionicModal.fromTemplateUrl('app/directive/photoCommentDirective.html', {
                        scope          : $scope,
                        focusFirstInput: true
                    }).then(function (modal) {
                        $scope.modal = modal;
                        $scope.modal.show();

                    });
                }

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


                    Gallery.comments({galleryId: $scope.ngModel.id}).then(function (resp) {
                        $scope.comments         = resp;
                        $scope.ngModel.comments = resp;
                        $scope.loading          = false;

                        $timeout(function () {
                            // Scroll to bottom
                            $ionicScrollDelegate.scrollBottom();
                        }, 1);
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
                            $rootScope.$emit('openKeyboard');
                            Loading.end();
                            $scope.closeModal();
                        });
                    }
                }


            }
        };
    }

})();
