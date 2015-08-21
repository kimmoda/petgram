(function () {
    'use strict';
    angular
        .module('ionic-loading', [
            'ionic',
            'angular-loading-bar'
        ])
        .config(function (cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeBar = false;
        })
        .directive('ionLoading', function ($rootScope) {
            return {
                restrict: 'E',
                scope   : {
                    icon: '@'
                },
                link    : function (scope, elem) {
                    $rootScope.$on('cfpLoadingBar:started', function () {
                        console.log('Loading !!!');
                        scope.loading = true;
                    });
                    $rootScope.$on('cfpLoadingBar:completed', function () {
                        scope.loading = false;
                    });
                },
                template: '<div class="padding text-center loading" ng-show="loading"><ion-spinner icon="{{ icon }}"></ion-spinner></div>'
            }
        })
        .factory('Loading', function ($rootScope, $timeout) {

            var seconds = 2;

            function showLoading() {
                $rootScope.$broadcast('ionicLoading:true');
            }

            function hideLoading() {
                $timeout(function () {
                    $rootScope.$broadcast('ionicLoading:false');
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

            $rootScope.$on('loading:true', function () {
                //$ionicLoading.show();
                $rootScope.loading = true;
            });
            $rootScope.$on('loading:false', function () {
                $rootScope.loading = false;
                //$ionicLoading.hide();
            });

            $rootScope.$on('ionicLoading:true', function () {
                $ionicLoading.show();
            });
            $rootScope.$on('ionicLoading:false', function () {
                $ionicLoading.hide();
            });
        })
    ;
})();