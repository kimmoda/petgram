'use strict';
angular
    .module ('module.alimento')
    .controller ('AlimentosCtrl', function ($scope, grupo, Alimento, $stateParams) {
    var self   = this;
    self.title = grupo.nome;

    Alimento
        .get ($stateParams.id)
        .then (function (resp) {
        self.data = resp;
    });

    self.closeModal = function () {
        $scope.closeModal (null);
    };

});
