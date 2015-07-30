'use strict';
angular
    .module ('module.todo')
    .controller ('TodoCtrl', function () {
    var self = this;
    self.data = [
        {title: 'Teste', complete: false},
        {title: 'Teste 2', complete: false},
        {title: 'Teste 3', complete: false}
    ];
});