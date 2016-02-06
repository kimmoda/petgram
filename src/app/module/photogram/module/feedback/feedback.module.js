(function () {
    'use strict';
    var path = 'app/module/photogram/module/feedback';
    angular
        .module('app.feedback', [])
        .config(function  ($translatePartialLoaderProvider) {
            // Translation
            $translatePartialLoaderProvider.addPart(path);
        });

})();
