'use strict';
angular
    .module ('module.chat')
    .controller ('ChatMessagesCtrl', function ($scope, User, toUser, $rootScope, $state, $stateParams, Chat, $ionicActionSheet, $ionicPopup, $ionicScrollDelegate, $timeout, $interval) {

        var fromUser = $rootScope.user;

        $scope.data = Chat.get ();

        console.log (toUser);

        $scope.toUser = {
            _id     : toUser.attributes.id,
            pic     : toUser.attributes.img,
            username: toUser.name
        };

        $scope.user = {
            _id     : $scope.data.currentUser.id,
            pic     : fromUser.imgsmall,
            username: fromUser.first_name
        };

        var messageCheckTimer;

        var viewScroll = $ionicScrollDelegate.$getByHandle ('userMessageScroll');
        var txtInput; // ^^^

        getMessages (toUser);


        messageCheckTimer = $interval (function () {
            //getMessages ();
        }, 2000);

        function getMessages () {
            // the service is mock but you would probably pass the toUser's GUID here
            Chat
                .messages (toUser)
                .then (function (data) {
                $scope.doneLoading = true;
                $scope.messages    = data;

                $timeout (function () {
                    viewScroll.scrollBottom ();
                }, 0);
            });
        }

        $scope.sendMessage = function (rForm) {

            if (rForm.$valid) {
                var message = {
                    to  : $scope.toUser._id,
                    body: $scope.input.message
                }

                console.log (message);

                Chat
                    .send (toUser, message)
                    .then (function (resp) {
                    console.log (resp);
                    $scope.input.message = '';
                    getMessages ();
                    viewScroll.scrollBottom (true);

                });
            }
        };

        // this keeps the keyboard open on a device only after sending a message, it is non obtrusive
        function keepKeyboardOpen () {
            console.log ('keepKeyboardOpen');
            txtInput.one ('blur', function () {
                console.log ('textarea blur, focus back on it');
                txtInput[0].focus ();
            });
        }


    }
);