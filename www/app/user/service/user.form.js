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
        },
        {
            type           : 'input',
            key            : 'confirmpassword',
            templateOptions: {
                type           : 'password',
                placeholder    : gettextCatalog.getString ('Confirmar Senha'),
                icon           : 'icon-lock',
                required       : true,
                iconPlaceholder: true
            }
        }
    ];

    var profile = [
        {
            type           : 'input',
            key            : 'first_name',
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
            key            : 'last_name',
            templateOptions: {
                type           : 'text',
                placeholder    : gettextCatalog.getString ('Sobrenome'),
                icon           : 'icon-user',
                required       : true,
                iconPlaceholder: true
            }
        },
        {
            key            : 'gender',
            type           : 'select',
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
            type           : 'input',
            key            : 'location',
            templateOptions: {
                type           : 'text',
                placeholder    : gettextCatalog.getString ('Endereço'),
                icon           : 'icon-map',
                required       : true,
                iconPlaceholder: true
            }
        },
        {
            type           : 'input',
            key            : 'email',
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