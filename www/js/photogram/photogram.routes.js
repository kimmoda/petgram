(function (window, angular, undefined) {
    'use strict';
    angular
        .module('app.photogram')
        .config(addRoute);

    function addRoute($stateProvider, AppConfig) {

        var path = AppConfig.path;

        $stateProvider


            .state('photogram', {
                url: '/photogram',
                abstract: true,
                templateUrl: path + '/tabs/photogram.tabs.html',
                controller: 'PhotogramTabsCtrl as vm'
            })

            .state('photogram.home', {
                url: '/home',
                views: {
                    tabHome: {
                        controller: 'PhotogramHomeCtrl as vm',
                        templateUrl: path + '/home/photogram.home.html'
                    }
                }
            })

            .state('photogram.popular', {
                url: '/popular',
                views: {
                    tabPopular: {
                        controller: 'PhotogramPopularCtrl as vm',
                        templateUrl: path + '/popular/photogram.popular.html'
                    }
                }
            })

            .state('photogram.search', {
                url: '/search',
                abstract: true,
                views: {
                    tabSearch: {
                        templateUrl: path + '/search/photogram.search.tabs.html'
                    }
                }
            })

            .state('photogram.search.grid', {
                url: '/grid',
                views: {
                    tabGrid: {
                        controller: 'PhotogramSearchGridCtrl as vm',
                        templateUrl: path + '/search/photogram.search.grid.html'
                    }
                }
            })
            .state('photogram.search.map', {
                url: '/map',
                views: {
                    tabMap: {
                        controller: 'PhotogramSearchMapCtrl as vm',
                        templateUrl: path + '/search/photogram.search.map.html'
                    }
                }
            })


            .state('photogram.activity', {
                url: '/activity',
                views: {
                    tabActivity: {
                        controller: 'PhotogramActivityCtrl as vm',
                        templateUrl: path + '/activity/photogram.activity.html'
                    }
                }
            })

            .state('userlist', {
                url: '/follow',
                controller: 'PhotogramUserListCtrl as vm',
                templateUrl: 'js/user/friend/user.list.html'
            })

            .state('photogram.account', {
                url: '/account',
                views: {
                    tabProfile: {
                        controller: 'PhotogramProfileCtrl as vm',
                        templateUrl: 'js/user/profile/profile.html'
                    }
                }
            })


        ;
    }

})(window, window.angular);
