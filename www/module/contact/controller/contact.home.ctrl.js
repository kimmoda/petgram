'use strict';
angular
    .module ('module.contact')
    .controller ('ContactHomeCtrl', function (Contact) {
    var self = this;

    Contact
        .find ()
        .then (function (resp) {
        console.log (resp);
        self.data = resp;
    });

});