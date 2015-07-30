'use strict';
angular
    .module ('module.friend')
    .config (function ($stateProvider) {
    $stateProvider
        .state ('app.friend', {
        url     : '/friend',
        abstract: true,
        views   : {
            menuContent: {
                templateUrl: 'app/friend/view/friend.tab.html'
            }
        }
    })

        .state ('app.friend.home', {
        url  : '/home',
        views: {
            tabHome: {
                controller : 'FriendHomeCtrl as FriendHome',
                templateUrl: 'app/friend/view/friend.home.html'
            }
        }
    })

        .state ('app.friend.list', {
        url  : '/list',
        views: {
            tabList: {
                controller : 'FriendListCtrl as FriendList',
                templateUrl: 'app/friend/view/friend.list.html'
            }
        }
    })
    ;
});