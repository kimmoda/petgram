'use strict';
angular
    .module ('module.feedback')
    .factory ('FeedbackForm', function (gettextCatalog) {

    var form = [
        {
            type           : 'input',
            key            : 'name',
            templateOptions: {
                type           : 'text',
                placeholder    : gettextCatalog.getString ('Titulo'),
                icon           : 'icon-info',
                required       : true,
                iconPlaceholder: true
            }
        },
        {
            key            : 'subject',
            type           : 'select',
            templateOptions: {
                label          : gettextCatalog.getString ('Assunto'),
                options        : [
                    {
                        'label': gettextCatalog.getString ('Sugestão'),
                        'id'   : 'sugestion',
                    },
                    {
                        'label': gettextCatalog.getString ('Reclamação'),
                        'id'   : 'alert',
                    },
                    {
                        'label': gettextCatalog.getString ('Erro'),
                        'id'   : 'error',
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
            type           : 'textarea',
            key            : 'message',
            templateOptions: {
                type           : 'textarea',
                placeholder    : 'Descrição',
                icon           : 'icon-lock',
                required       : true,
                iconPlaceholder: true
            }
        }
    ];
    return {
        form: form
    };


});