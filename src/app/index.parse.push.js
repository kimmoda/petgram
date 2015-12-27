(function () {
  'use strict';
  angular
    .module('starter')
    .run(runParsePush);

  function runParsePush($ionicPlatform, $rootScope, $q, $document, $cordovaPush, AppConfig, $window) {

    if ($window.cordova) {
      //$document.addEventListener('ready', resetBadge, true);
      //$document.addEventListener('pause', resetBadge, true);
      //$document.addEventListener('resume', resetBadge, true);
    }

    function resetBadge() {
      var defer = $q.defer();
      $cordovaPush
        .setBadgeNumber(0)
        .then(defer.resolve);
      return defer.promise;
    }

    $ionicPlatform.ready(function () {
      if ($window.cordova) {

        resetBadge();
        startPush()
          .then(pushCallback);

        $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
          switch (notification.event) {
          case 'registered':
            if (notification.regid.length > 0) {
              alert('registration ID = ' + notification.regid);
            }
            break;

          case 'message':
            // this is the actual push notification. its format depends on the data model from the push server
            alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
            break;

          case 'error':
            alert('GCM error = ' + notification.msg);
            break;

          default:
            alert('An unknown GCM event has occurred');
            break;
          }
        });

      }
    });

    function pushCallback() {
      $window
        .parsePlugin
        .registerCallback('onNotification', function () {
          $window.onNotification = function (pnObj) {
            $window.alert('Push mensagem', JSON.stringify(pnObj));

            if (pnObj.receivedInForeground === false) {

            }
          };
        }, function (error) {
          console.log('Erro', error);
        });
    }


    function startPush() {
      var defer = $q.defer();

      $window
        .parsePlugin
        .initialize(AppConfig.parse.applicationId, AppConfig.parse.clientKey, function () {

          $window
            .parsePlugin
            .subscribe('Photogram', function () {
              $window
                .parsePlugin
                .getInstallationId(defer.resolve, defer.reject);

            }, defer.reject);

        }, defer.reject);

      return defer.promise;
    }
  }

})();
