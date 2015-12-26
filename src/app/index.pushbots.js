(function () {
  'use strict';
  angular
    .module('starter')
    .run(runPushbots);

  function runPushbots($ionicPlatform) {
    var credentials = [
      '56784da8177959b6198b456e',
      'AIzaSyCKPERlz0PEBd1QA6pB0ewyCc34QP4IoEM'
    ];

    $ionicPlatform.ready(function () {
      if (window.cordova) {

        if (PushbotsPlugin.isAndroid()) {
          console.log('Pushbots Android');
          PushbotsPlugin.initializeAndroid(credentials);

          //Get device token
          PushbotsPlugin.getToken(function (token) {
            console.log(token);
          });

          //Reset Badge
          PushbotsPlugin.resetBadge();
        }

        if (PushbotsPlugin.isiOS()) {
          PushbotsPlugin.initializeiOS(credentials[0]);
          console.log('Pushbots iOS');
          //Get device token
          PushbotsPlugin.getToken(function (token) {
            console.log(token);
          });

          //Reset Badge
          PushbotsPlugin.resetBadge();

        }

      }
    });
  }

})();
