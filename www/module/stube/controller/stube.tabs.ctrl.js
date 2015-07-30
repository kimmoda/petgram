'use strict';
angular
    .module ('module.stube')
    .controller ('TabsCtrl', function (Stube) {
    var self  = this;
    self.data = Stube.getData ();

});