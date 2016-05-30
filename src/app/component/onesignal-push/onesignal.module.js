(function () {
    'use strict';
    angular
        .module('onesignal', [])
        .factory('OneSignal', function ($q) {

            return {
                init: init
            };

            function init(id, google) {
                var defer = $q.defer();

                if (window.cordova) {
                    // Enable to debug issues.
                    window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
                    
                    // Update with your OneSignal AppId and googleProjectNumber before running.
                    window.plugins.OneSignal.init(id, {googleProjectNumber: google}, function (jsonData) {
                        // alert("Notification received:\n" + JSON.stringify(jsonData));
                        console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
                        defer.resolve(jsonData);
                    });

                    window.plugins.OneSignal.enableInAppAlertNotification(true);
                } else {
                    defer.reject('not cordova app');
                }
                return defer.promise;
            }
        });

})();