'use strict';
angular
    .module ('module.chat')
    .run (function ($rootScope, gettextCatalog) {
    // Add Menu
    $rootScope.addMenu ({
        route: 'app.chat',
        icon : 'ion-chatboxes',
        name : gettextCatalog.getString ('Chat')
    });
});


// configure moment relative time
moment.locale ('en', {
    relativeTime: {
        future: 'in %s',
        past  : '%s ago',
        s     : '%d sec',
        m     : 'a minute',
        mm    : '%d minutes',
        h     : 'an hour',
        hh    : '%d hours',
        d     : 'a day',
        dd    : '%d days',
        M     : 'a month',
        MM    : '%d months',
        y     : 'a year',
        yy    : '%d years'
    }
});
