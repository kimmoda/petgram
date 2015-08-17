(function () {
    'use strict';
    angular
        .module('module.user')
        .config(function ($facebookProvider) {
            // Dev
            $facebookProvider.setAppId('1024016557617380');
        })
        .run(function ($window, FacebookConfig) {
            // Load the facebook SDK asynchronously

            if (!($window.ionic.Platform.isIOS() || $window.ionic.Platform.isAndroid())) {
                $window.fbAsyncInit = function () {
                    $window.Parse.FacebookUtils.init({
                        appId  : FacebookConfig.api,
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

            //(function () {
            //    // If we've already installed the SDK, we're done
            //    if (document.getElementById ('facebook-jssdk')) {return;}
            //
            //    // Get the first script element, which we'll use to find the parent node
            //    var firstScriptElement = document.getElementsByTagName ('script')[0];
            //
            //    // Create a new script element and set its id
            //    var facebookJS = document.createElement ('script');
            //    facebookJS.id  = 'facebook-jssdk';
            //
            //    // Detect language
            //    var LangVar     = navigator.language || navigator.userLanguage;
            //    var userLangVar = LangVar.substring (0, 2) + '_' + LangVar.substring (3, 5).toUpperCase ();
            //
            //    // Set the new script's source to the source of the Facebook JS SDK
            //    facebookJS.src = 'http://connect.facebook.net/' + userLangVar + '/all.js';
            //
            //    // Insert the Facebook JS SDK into the DOM
            //    firstScriptElement.parentNode.insertBefore (facebookJS, firstScriptElement);
            //} ());
        });
})();