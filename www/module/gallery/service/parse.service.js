'use strict';
angular
    .module ('module.gallery')
    .service ('ParseService', function ($q, $window, ParseConfig) {

    function initialize () {
        console.log ('Missing Parse Plugin ' + JSON.stringify ($window.parsePlugin));

        var deferred = $q.defer ();
        $window.parsePlugin.initialize (ParseConfig.applicationId, ParseConfig.clientKey, function () {
            console.log ('Initialized Parse Plugin');
            deferred.resolve ('success');
        }, function (e) {
            deferred.reject (e);
        });
        return deferred.promise;
    }

    function getInstallationId () {
        var deferred = $q.defer ();
        $window.parsePlugin.getInstallationId (function (id) {
            deferred.resolve (id);
        }, function (e) {
            deferred.reject (e);
        });
        return deferred.promise;
    }

    function subscribe (_channel) {
        var deferred = $q.defer ();
        $window.parsePlugin.subscribe (_channel, function () {
            deferred.resolve (true);
        }, function (e) {
            deferred.reject (false);
        });
        return deferred.promise;
    }

    function unsubscribe (_channel) {
        var deferred = $q.defer ();
        $window.parsePlugin.unsubscribe (_channel, function () {
            deferred.resolve (true);
        }, function (e) {
            deferred.reject (false);
        });
        return deferred.promise;
    }

    function getSubscriptions () {
        var deferred = $q.defer ();
        $window.parsePlugin.getSubscriptions (function (_channelsArray) {
            deferred.resolve (_channelsArray);
        }, function (e) {
            deferred.reject (false);
        });
        return deferred.promise;
    }

    function registerCallback (_pushCallback) {
        var deferred = $q.defer ();
        $window.parsePlugin.registerCallback ('onNotification', function () {

            $window.onNotification = function (pnObj) {

                _pushCallback && _pushCallback (pnObj);

                alert ('We received this push notification: ' + JSON.stringify (pnObj));
                if (pnObj.receivedInForeground === false) {
                    // TODO: route the user to the uri in pnObj
                }
            };
            deferred.resolve (true);

        }, function (error) {
            deferred.reject (error);
        });
        return deferred.promise;

    }

    return {
        initialize       : initialize,
        getInstallationId: getInstallationId,
        subscribe        : subscribe,
        unsubscribe      : unsubscribe,
        getSubscriptions : getSubscriptions,
        registerCallback : registerCallback
    };
});