(function () {
    'use strict';
    var FACEBOOK = '1024016557617380'

    angular
        .module('starter')
        .config(function ($facebookProvider) {
            $facebookProvider.setAppId(FACEBOOK);
        })
        .run(function ($window) {
            // Load the facebook SDK asynchronously
            if (!($window.ionic.Platform.isIOS() || $window.ionic.Platform.isAndroid())) {
                $window.fbAsyncInit = function () {
                    $window.Parse.FacebookUtils.init({
                        appId  : FACEBOOK,
                        version: 'v2.3',
                        xfbml  : true
                    });
                };

                (function (d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) {
                        return;
                    }
                    js              = d.createElement(s);
                    js.id           = id;
                    var LangVar     = navigator.language || navigator.userLanguage;
                    var userLangVar = LangVar.substring(0, 2) + '_' + LangVar.substring(3, 5).toUpperCase();
                    // Set the new script's source to the source of the Facebook JS SDK
                    js.src = 'http://connect.facebook.net/' + userLangVar + '/all.js';
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));
            }
        });
})();