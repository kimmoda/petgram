# Example


'use strict';
angular
    .module('module.simulador')
    .factory('Simulador', function (Modal) {

        function openSimulador(view) {
            return Modal.show('modules/simulador/views/simulador.home.html', 'SimuladorHomeCtrl as SimuladorHome', view);
        }

        return {
            open: openSimulador
        }

    })
    .controller('module',function(){
        var self = this;
    
        self.closeModal = function () {
            $scope.closeModal(null);
        };
    });
