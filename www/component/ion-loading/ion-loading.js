(function () {
    'use strict';
    angular
        .module('ionic-loading', ['ionic'])
        .directive('ionLoading', function ($rootScope) {
            return {
                restrict: 'E',
                scope   : {
                    icon: '@'
                },
                link    : function (scope, elem) {
                    $rootScope.$on('loading:true', function () {
                        console.log('Loading !!!');
                        scope.loading = true;
                    });
                    $rootScope.$on('loading:false', function () {
                        scope.loading = false;
                    });
                },
                template: '<div class="padding text-center loading" ng-show="loading"><ion-spinner icon="{{ icon }}"></ion-spinner></div>'
            }
        })
        .factory('Loading', function ($rootScope, $timeout) {

            var seconds = 2;

            function showLoading() {
                $rootScope.$broadcast('loading:show');
            }

            function hideLoading() {
                $timeout(function () {
                    $rootScope.$broadcast('loading:hide');
                }, parseInt(seconds + '000'));
            }

            return {
                start: showLoading,
                end  : hideLoading,
            }
        }
    )
        .run(function ($rootScope, $ionicLoading) {
            //Loading
            $rootScope.$on('loading:show', function () {
                $ionicLoading.show();
            });
            $rootScope.$on('loading:hide', function () {
                $ionicLoading.hide();
            });

            $rootScope.$on('loading:true', function () {
                $rootScope.loading = true;
            });
            $rootScope.$on('loading:false', function () {
                $rootScope.loading = false;
            });
        })

        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('loadingInterceptor');

        })
        .factory('loadingInterceptor', function ($rootScope, $q) {
            return function (promise) {
                $rootScope.$broadcast('loading:true');
                return promise
                    .then(function (response) {
                        $rootScope.$broadcast('loading:false');
                        return response
                    }, function (response) {
                        $rootScope.$broadcast('loading:false');
                        $q.reject(response);
                    })
            }

            /*

             var numLoadings = 0;

             function request(config) {
             numLoadings++;
             //Loading.show ();
             console.log('Loading start', numLoadings);
             $rootScope.$broadcast('loading:true');
             return config || $q.when(config);
             }

             function response(response) {
             if (--numLoadings === 0) {
             //Loading.hide ();
             console.warn('Loading end', numLoadings);
             $rootScope.$broadcast('loading:false');
             }
             return response || $q.when(response);
             }

             function responseError(response) {
             if (--numLoadings === 0) {
             //Loading.hide ();
             console.log('Loading end');
             $rootScope.$broadcast('loading:false');
             }
             return $q.reject(response);
             }

             return {
             request      : request,
             response     : response,
             responseError: responseError
             };/*
             */
        });
    ;
})();