'use strict';
angular
    .module ('module.user')
    .config (function ($stateProvider) {
    $stateProvider

        .state ('intro', {
        url        : '/intro',
        templateUrl: 'app/user/view/user.intro.html',
        controller : 'IntroCtrl as Intro'
    })

        .state ('user', {
        url        : '/user',
        abstract   : true,
        templateUrl: 'app/user/view/user.tabs.html'
    })

        .state ('user.login', {
        url  : '/login',
        views: {
            tabLogin: {
                controller : 'LoginCtrl as Login',
                templateUrl: 'app/user/view/user.login.html'
            }
        }
    })

        .state ('user.register', {
        url  : '/register',
        views: {
            tabLogin: {
                controller : 'RegisterCtrl as Register',
                templateUrl: 'app/user/view/user.register.html'
            }
        }
    })

        .state ('logout', {
        url       : '/logout',
        template  : '<ion-view view-title="Logout" cache-view="false"><ion-content></ion-content></ion-view>',
        controller: function (User, $state) {
            User
                .logout ()
                .then (function () {
                $state.go ('user.login', {clear: true});
            });
        }
    })

        .state ('app.userlist', {
        url  : '/users',
        views: {
            menuContent: {
                controller : 'UserListCtrl as UserList',
                templateUrl: 'app/user/view/user.list.html'
            }
        }
    })


        .state ('app.profile', {
        url  : '/profile',
        views: {
            menuContent: {
                controller : 'UserProfileCtrl as Profile',
                templateUrl: 'app/user/view/user.profile.html'
            }
        }
    })

        .state ('app.profile.friends', {
        url  : '/friends',
        views: {
            tabFriend: {
                controller : 'UserProfileFriendCtrl as UserProfileFriend',
                templateUrl: 'app/user/view/user.profile.friends.html'
            }
        }
    })

    ;

});
