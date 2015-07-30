'use strict';
angular
    .module ('module.contact')
    .controller ('ContactViewCtrl', function (contact) {
    var self  = this;
    self.data = contact;
});