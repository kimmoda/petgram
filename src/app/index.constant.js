(function () {
    'use strict';
    angular
        .module('ionic')
        .constant('AppConfig', AppConfig());

    function AppConfig() {
        return {
            path: 'app/module/photogram',
            app: {
                name: 'Photogram',
                url: 'http://photogramapp.com',
                image: 'http://photogramapp.com/social-share.jpg',
            },
            routes: {
                home: 'photogram.home',
                login: 'intro'
            },
            color: '#00796B',
            facebook: '1024016557617380',
            parse: {
                applicationId: '7lWT9DJntSvMKTetpoT0wL79pTG9dk4ob5pztktX',
                javascriptKey: 'UbrjB5Imc0btrAyoSb83HmCAHmFWc77JEB9AA1to'
            },
            locales: {
                pt: {
                    'translation': 'LANG.PORTUGUES',
                    'code': 'pt'
                },
                en: {
                    'translation': 'LANG.ENGLISH',
                    'code': 'en'
                },
                tr: {
                    'translation': 'LANG.TURKISH',
                    'code': 'tr'
                },
                fa: {
                    'translation': 'LANG.PERSINA',
                    'code': 'fa'
                },
                de: {
                    'translation': 'LANG.GERMAN',
                    'code': 'de'
                }
            },
            preferredLocale: 'en'
        };
    }
})();
