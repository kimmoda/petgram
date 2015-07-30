'use strict';
angular
    .module ('module.contact')
    .config (function ($stateProvider) {
    $stateProvider
        .state ('app.contact', {
        url  : '/contact',
        views: {
            menuContent: {
                controller : 'ContactHomeCtrl as ContactHome',
                templateUrl: 'module/contact/view/contact.home.html'
            }
        }
    })
        .state ('app.contactView', {
        url  : '/contact/:id',
        views: {
            menuContent: {
                resolve    : {
                    contact: function ($stateParams, Contact) {
                        return Contact.get ($stateParams.id);
                    }
                },
                controller : 'ContactViewCtrl as ContactView',
                templateUrl: 'module/contact/view/contact.view.html'
            }
        }
    })
    ;
});