'use strict';
angular
    .module ('module.core')
    .factory ('Parse', function ($window) {
    return $window.Parse;
});