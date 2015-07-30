'use strict';
angular
    .module ('module.core')
    .filter ('dateBr', function () {
    return function (input) {
        if (input) {
            var data, dia, mes, ano;
            data = input.split ('/');
            mes  = data[0] - 1;
            dia  = data[1];
            ano  = data[2];
            console.log (input);
            return new Date (ano, mes, dia);
        }
    };
});