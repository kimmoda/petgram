(function () {
    'use strict';
    var path = 'app/module/photogram/module/share';
    angular
        .module('app.share', [])
        .config(function ($translatePartialLoaderProvider) {
            // Translation
            $translatePartialLoaderProvider.addPart(path);
        });

})();