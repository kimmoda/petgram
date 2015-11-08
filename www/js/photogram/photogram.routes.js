(function (window, angular, undefined) {
    'use strict';
    angular
        .module('app.photogram')
        .config(addRoute);

    function addRoute($stateProvider, AppConfig) {

        var path = AppConfig.path;

        $stateProvider

            .state('userlist', {
                url: '/follow',
                controller: 'PhotogramUserListCtrl as vm',
                templateUrl: path + '/user/friend/photogram.user.list.html'
            })


            .state('photogram', {
                url: '/photogram',
                abstract: true,
                templateUrl: path + '/layout/photogram.tabs.html'
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

            .state('photogram.capture', {
                url: '/capture',
                views: {
                    tabCapture: {
                        controller: 'PhotogramCaptureCtrl as vm',
                        templateUrl: path + '/capture/photogram.capture.html'
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

            .state('photogram.account', {
                url: '/account',
                abstract: true,
                views: {
                    tabProfile: {
                        controller: 'PhotogramProfileCtrl as PhotogramProfile',
                        templateUrl: path + '/user/profile/photogram.profile.html'
                    }
                }
            })

            .state('photogram.account.list', {
                url: '/list',
                views: {
                    tabUser: {
                        controller: 'PhotogramProfilePhoto as vm',
                        templateUrl: path + '/user/profile/list.html'
                    }
                }
            })

            .state('photogram.account.grid', {
                url: '/grid',
                views: {
                    tabUser: {
                        controller: 'PhotogramProfilePhoto as vm',
                        templateUrl: path + '/user/profile/grid.html'
                    }
                }
            })

        ;
    }

})(window, window.angular);
