'use strict';
angular
    .module ('module.facebook')
    .config (function ($stateProvider) {
    $stateProvider

        .state ('app.facebook', {
        url     : '/facebook',
        abstract: true,
        views   : {
            menuContent: {
                templateUrl: 'module/facebook/view/facebook.tab.html'
            }
        }
    })

        .state ('app.facebook.feed', {
        url  : '/mural',
        tabs : true,
        views: {
            tabFeed: {
                controller : 'FacebookFeedCtrl as FacebookFeed',
                templateUrl: 'module/facebook/view/facebook.feed.html'
            }
        }
    })

        .state ('app.facebook.friends', {
        url  : '/amigos',
        tabs : true,
        views: {
            tabFriends: {
                controller : 'FacebookFriendListCtrl as FacebookFriendList',
                templateUrl: 'module/facebook/view/facebook.friend.list.html'
            }
        }
    })

        .state ('app.facebook.mutual', {
        url  : '/mutual',
        tabs : true,
        views: {
            tabMutualfriends: {
                controller : 'FacebookFriendMutualCtrl as FacebookFriendList',
                templateUrl: 'module/facebook/view/facebook.friend.list.html'
            }
        }
    })

});
