'use strict';
angular
    .module ('module.stube')
    .controller ('HistoryCtrl', function ($scope, Analytics, Stube) {
    var self = this;

    Analytics.view ('Histórico de Videos');

    self.data = Stube.getData ();

    self.cleanHistory = function () {
        Stube.cleanHistory ();
        Analytics.event ('Histórico de Vídeo', 'Histórico', 'Limpar', 'Todos');
    };

    self.remove = function (video) {
        Analytics.event ('Histórico de Vídeo', 'Remover', 'Video', video);
        Stube.removeHistory (video);
    };
});