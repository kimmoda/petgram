'use strict';
angular
    .module ('module.miscellaneous')
    .factory ('Miscellaneous', function ($http, $q) {
        // todo: video
        // todo: push local
        // todo: push ionic
        // todo: push parse
        // todo: ionic analytics
        // todo: local push
        // todo: formyly
        // todo: header fade
        // todo: security

        var data = [
            {
                title: 'Capturar Vídeo',
                sref : 'app.miscellaneousVideo'
            },
            {
                title: 'Fromulário com Formyly',
                sref : 'app.miscellaneousFormyly'
            }
        ]
        return {
            data: data
        };

    }
);