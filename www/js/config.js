'use strict';
angular
    .module ('starter')
    .value ('AppConfig', {
        STATUSBAR: '#0099CC'
    })
    .value ('ParseConfig', {
    applicationId: '7lWT9DJntSvMKTetpoT0wL79pTG9dk4ob5pztktX',
    javascriptKey: 'UbrjB5Imc0btrAyoSb83HmCAHmFWc77JEB9AA1to',
    clientKey    : 'UbrjB5Imc0btrAyoSb83HmCAHmFWc77JEB9AA1to',
    USING_PARSE  : false,
    initialized  : false
})
    .value ('BlogConfig', {
    WORDPRESS: 'http://localhost:8100/blog/?json='
});
