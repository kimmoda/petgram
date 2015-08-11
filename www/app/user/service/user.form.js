'use strict';
angular
    .module ('module.user')
    .factory ('UserForm', function (gettextCatalog) {

    var login = [
        {
            type           : 'input',
            key            : 'email',
            templateOptions: {
                type           : 'email',
                placeholder    : gettextCatalog.getString ('Email'),
                icon           : 'icon-envelope',
                required       : true,
                iconPlaceholder: true
            }
        },
        {
            type           : 'input',
            key            : 'password',
            templateOptions: {
                type           : 'password',
                placeholder    : gettextCatalog.getString ('Senha'),
                icon           : 'icon-lock',
                required       : true,
                iconPlaceholder: true
            }
        }
    ];

    var register = [
        {
            type           : 'input',
            key            : 'name',
            templateOptions: {
                type           : 'text',
                placeholder    : gettextCatalog.getString ('Nome'),
                icon           : 'icon-user',
                required       : true,
                iconPlaceholder: true
            }
        },
        {
            type           : 'input',
            key            : 'email',
            templateOptions: {
                type           : 'email',
                placeholder    : gettextCatalog.getString ('Email'),
                icon           : 'icon-envelope',
                required       : true,
                iconPlaceholder: true
            }
        },
        {
            type           : 'input',
            key            : 'birthday',
            templateOptions: {
                type           : 'date',
                placeholder    : gettextCatalog.getString ('Data de Nascimento'),
                icon           : 'icon-present',
                required       : false,
                iconPlaceholder: true
            }
        },
        {
            type           : 'input',
            key            : 'password',
            templateOptions: {
                type           : 'password',
                placeholder    : gettextCatalog.getString ('Senha'),
                icon           : 'icon-lock',
                required       : true,
                iconPlaceholder: true
            }
        }
    ];

    var profile = [
        {
            key            : 'name',
            type           : 'input',
            templateOptions: {
                type           : 'text',
                placeholder    : gettextCatalog.getString ('Nome'),
                icon           : 'icon-user',
                required       : true,
                iconPlaceholder: true
            }
        },
        {
            key            : 'status',
            type           : 'input',
            templateOptions: {
                type           : 'text',
                placeholder    : gettextCatalog.getString ('Comentário'),
                icon           : 'ion-quote',
                required       : true,
                iconPlaceholder: true
            }
        },
        {
            type           : 'select',
            key            : 'gender',
            templateOptions: {
                label          : gettextCatalog.getString ('Genêro'),
                options        : [
                    {
                        'label': 'Homem',
                        'id'   : 'male',
                    },
                    {
                        'label': 'Mulher',
                        'id'   : 'female',
                    }
                ],
                //groupProp: 'gender',
                valueProp      : 'id',
                labelProp      : 'label',
                icon           : 'icon-list',
                iconPlaceholder: true
            }
        },
        {
            key            : 'phone',
            type           : 'input',
            templateOptions: {
                type           : 'text',
                placeholder    : gettextCatalog.getString ('Telefone'),
                icon           : 'ion-iphone',
                required       : true,
                iconPlaceholder: true
            }
        },
        {
            key            : 'site',
            type           : 'input',
            templateOptions: {
                type           : 'text',
                placeholder    : gettextCatalog.getString ('Site'),
                icon           : 'ion-earth',
                required       : true,
                iconPlaceholder: true
            }
        },
        {
            key            : 'location',
            type           : 'input',
            templateOptions: {
                type           : 'text',
                placeholder    : gettextCatalog.getString ('Endereço'),
                icon           : 'icon-map',
                required       : true,
                iconPlaceholder: true
            }
        },
        {
            key            : 'email',
            type           : 'input',
            templateOptions: {
                type           : 'email',
                placeholder    : 'Email',
                icon           : 'icon-envelope',
                required       : true,
                iconPlaceholder: true
            }
        },
        {
            type           : 'input',
            key            : 'birthday',
            templateOptions: {
                type           : 'date',
                placeholder    : gettextCatalog.getString ('Data de Nascimento'),
                icon           : 'icon-present',
                required       : true,
                iconPlaceholder: true
            }
        }
    ];

    return {
        login   : login,
        register: register,
        profile : profile
    };

});