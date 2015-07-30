'use strict';
angular
    .module ('module.stube')
    .filter ('moment', function () {
    return function (date, method) {
        var momented = moment (date);
        return momented[method].apply (momented, Array.prototype.splice.call (arguments, 2));
    }
});