'use strict';
angular
    .module ('module.gallery')
    .factory ('Parse', function ($window) {
    return $window.Parse;
});