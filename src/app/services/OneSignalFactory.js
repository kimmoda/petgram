(function () {
    'use strict';
    angular.module('starter').factory('OneSignal', OneSignalFactory);

    function OneSignalFactory($q) {

        return {
            init   : init,
            sendTag: sendTag,
            getIds : getIds,
        };

        function sendTag(key, value) {
            window.plugins.OneSignal.sendTag(key, value);
        }

        function getIds() {
            var defer = $q.defer();
            window.plugins.OneSignal.getIds(function (ids) {
                console.log('getIds: ' + JSON.stringify(ids));
                defer.resolve(ids);
            });
            return defer.promise;
        }

        function init(id, google) {
            var defer = $q.defer();

            if (window.cordova) {
                // Enable to debug issues.
                //window.plugins.OneSignal.setLogLevel({logLevel   : 4, visualLevel: 4});

                // Update with your OneSignal AppId and googleProjectNumber before running.
                window.plugins.OneSignal.init(id, {googleProjectNumber: google}, function (jsonData) {
                    console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
                    defer.resolve('OneSignal plugin installed');
                });

                window.plugins.OneSignal.enableInAppAlertNotification(true);

            } else {
                defer.reject('OneSignal plugin not istalled');
            }
            return defer.promise;
        }
    }

})();
