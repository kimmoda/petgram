(function () {
    'use strict';
    angular
        .module('app.photogram')
        .factory('PhotogramShare', PhotogramShareFactory);

    function PhotogramShareFactory($window, $translate, AppConfig) {
        return {
            share: share
        };

        function share(post) {
            console.log('Social Share', post);
            var message = ("I'm at ") + AppConfig.app.name + '! ' + (
                    'Install the application and follow me!') + ' ' + AppConfig.app.url;
            if ($window.cordova) {
                $window
                    .window
                    .plugins
                    .socialsharing
                    .share(post.text + ', ' + message, post.text, post.image, null);
            } else {
                alert('Only in smartphone');
            }
        }

    }

})();