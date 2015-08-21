(function () {
    'use strict';
    angular
        .module('ionic-loading', ['ionic'])
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
            var numLoadings = 0;

            function request(config) {
                numLoadings++;
                //Loading.show ();
                $rootScope.$broadcast('loading:true');
                return config || $q.when(config);
            }

            function response(response) {
                if (--numLoadings === 0) {
                    //Loading.hide ();
                    $rootScope.$broadcast('loading:false');
                }
                return response || $q.when(response);
            }

            function responseError(response) {
                if (--numLoadings === 0) {
                    //Loading.hide ();
                    $rootScope.$broadcast('loading:false');
                }
                return $q.reject(response);
            }

            return {
                request      : request,
                response     : response,
                responseError: responseError
            };
        });
    ;
})();