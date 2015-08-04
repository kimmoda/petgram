'use strict';
angular
    .module ('module.gallery')
    .factory ('Settings', function ($http, $q) {
    var data = {
        quality    : 80,
        allowEdit  : true,
        width      : 500,
        height     : 500,
        saveToAlbum: false
    };

    function settings () {
        return data;
    }

    return {
        settings: settings
    }

});