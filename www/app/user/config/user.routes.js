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
        .state ('login', {
        url        : '/login',
        templateUrl: 'app/user/view/user.login.html',
        controller : 'LoginCtrl as Login'
    })

        .state ('register', {
        url        : '/register',
        templateUrl: 'app/user/view/user.register.html',
        controller : 'RegisterCtrl as Register'
    })

        .state ('logout', {
        url       : '/logout',
        template  : '<ion-view view-title="Logout" cache-view="false"><ion-content></ion-content></ion-view>',
        controller: function (User, $state) {
            User
                .logout ()
                .then (function () {
                $state.go ('login', {clear: true});
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
