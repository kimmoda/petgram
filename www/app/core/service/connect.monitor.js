(function () {
    'use strict';
    angular
        .module('module.core')
        .factory('ConnectMonitor', function ($rootScope, $window, $ionicLoading, $cordovaNetwork) {

            function online() {
                $ionicLoading.hide();
            }

            function offline() {
                $ionicLoading.show({
                    template: 'Você está offline, conecte-se para continuar'
                });
            }

            function isOnline() {
                if ($window.ionic.Platform.isWebView()) {
                    return $cordovaNetwork.isOnline();
                } else {
                    return navigator.onLine;
                }
            }

            function ifOffline() {
                if ($window.ionic.Platform.isWebView()) {
                    return !$cordovaNetwork.isOnline();
                } else {
                    return !navigator.onLine;
                }
            }

            function startWatching() {
                if ($window.ionic.Platform.isWebView()) {

                    $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                        console.log("went online");
                        online();
                    });

                    $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
                        console.log("went offline");
                        offline();
                    });

                }
                else {

                    window.addEventListener("online", function (e) {
                        console.log("went online");
                        online();
                    }, false);

                    window.addEventListener("offline", function (e) {
                        console.log("went offline");
                        offline();
                    }, false);
                }
            }


            return {
                isOnline     : isOnline,
                ifOffline    : ifOffline,
                startWatching: startWatching
            };
        });
})();