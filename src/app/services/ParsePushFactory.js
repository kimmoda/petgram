(function () {
    'use strict';
    angular.module('starter').factory('ParsePush', ParsePushFactory);

    function ParsePushFactory($q, $cordovaDevice) {

        return {
            init         : init,
            on           : on,
            subscribe    : subscribe,
            unsubscribe  : unsubscribe,
            subscribeUser: subscribeUser,
        };


        function installation(installationId) {
            var installationObj = Parse.Object.extend('UserDevice');
            return new installationObj()
                .set('device', $cordovaDevice.getDevice())
                .set('cordova', $cordovaDevice.getCordova())
                .set('model', $cordovaDevice.getModel())
                .set('platform', $cordovaDevice.getPlatform())
                .set('uuid', $cordovaDevice.getUUID())
                .set('version', $cordovaDevice.getVersion())
                .set('user', Parse.User.current())
                .set('installationId', installationId)
                .save();
        }

        function init() {
            if (window.ParsePushPlugin) {

                ParsePushPlugin.getInstallationId(function (id) {
                    // note that the javascript client has its own installation id,
                    // which is different from the device installation id.
                    console.log("device installationId: " + id);
                    installation(id);
                }, function (e) {
                    console.log('error', e);
                });

                ParsePushPlugin.getSubscriptions(function (subscriptions) {
                    console.log(subscriptions);
                }, function (e) {
                    console.log('error', e);
                });


                on('receivePN', function (pn) {
                    console.log('yo i got this push notification:' + JSON.stringify(pn));
                });

                //
                // When the app is off or in background, push notifications get added
                // to the notification tray. When a user open a notification, you
                // can catch it via openPN
                on('openPN', function (pn) {
                    console.log('a notification was opened:' + JSON.stringify(pn));
                });
            }
        }


        function subscribeUser() {
            var user = Parse.User.current();
            if (window.ParsePushPlugin && user) {
                var channel = 'user_' + user.attributes.username;
                subscribe(channel);
            }
        }

        function on(event, callback) {
            if (window.ParsePushPlugin) {
                ParsePushPlugin.on(event, callback);
            }
        }

        function subscribe(channel) {
            var defer = $q.defer();
            if (window.ParsePushPlugin) {
                ParsePushPlugin.subscribe(channel, function (resp) {
                    console.log('Subcribe in channel', channel);
                    defer.resolve(resp);
                }, function (err) {
                    console.log('Not Subcribe in channel', channel);
                    defer.reject(err);
                });
            }
            return defer.promise;
        }

        function unsubscribe(channel) {
            var defer = $q.defer();
            if (window.ParsePushPlugin) {
                ParsePushPlugin.unsubscribe(channel, function (resp) {
                    console.log('Unsubcribe in channel', channel);
                    defer.resolve(resp);
                }, function (err) {
                    console.log('Not Unsubcribe in channel', channel);
                    defer.reject(err);
                });
            }
            return defer.promise;
        }
    }

})();