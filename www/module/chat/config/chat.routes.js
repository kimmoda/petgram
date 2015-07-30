'use strict';
angular
    .module ('module.chat')
    .config (function ($stateProvider) {
    $stateProvider
        .state ('app.chat', {
        url  : '/chat',
        views: {
            menuContent: {
                templateUrl: 'module/chat/view/chat.list.html',
                controller : 'ChatListCtrl as ChatList'
            }
        }
    })
        .state ('app.chatuser', {
        url  : '/chat/:user',
        views: {
            menuContent: {
                resolve    : {
                    toUser: function (User, $stateParams) {
                        return User
                            .getUser ($stateParams.user)
                            .then (function (resp) {
                            return resp;
                        });
                    }
                },
                templateUrl: 'module/chat/view/chat.messages.html',
                controller : 'ChatMessagesCtrl'
            }
        }
    });
});