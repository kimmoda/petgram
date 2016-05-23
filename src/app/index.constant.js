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
                login: 'user.login'
            },
            color: '#00796B',
            facebook: '1024016557617380',
            parse: {
                appId: 'myAppId',
                server: 'https://photogramserver.herokuapp.com/parse/'
            },
            locales: [
                {
                    translation: 'LANG.PORTUGUES',
                    code: 'pt'
                },
                {
                    translation: 'LANG.ENGLISH',
                    code: 'en'
                },
                {
                    translation: 'LANG.TURKISH',
                    code: 'tr'
                },
                {
                    translation: 'LANG.PERSIAN',
                    code: 'fa'
                },
                {
                    translation: 'LANG.GERMAN',
                    code: 'de'
                }
            ],
            preferredLocale: 'en'
        };
    }
})();