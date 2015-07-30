'use strict';
angular.module ('starter')
    .constant ('CONST', (function () {
    return {
        DEBUGMODE           : false,
        SHOWBROADCAST_EVENTS: true,
        ANALYTICS           : '1212',
        FACEBOOK            : 750930828289265,
        WORDPRESS           : 'http://localhost:8100/blog/?json=',
        PARSE               : {
            id : '7lWT9DJntSvMKTetpoT0wL79pTG9dk4ob5pztktX',
            key: 'UbrjB5Imc0btrAyoSb83HmCAHmFWc77JEB9AA1to'
        }
    };
}) ());
