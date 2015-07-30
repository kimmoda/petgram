'use strict';
angular
    .module ('module.facebook')
    .filter ('faceFoto', function () {
    return function (input) {
        if (input) {
            return 'http://graph.facebook.com/' + input + '/picture?type=small';
        }
    };
});