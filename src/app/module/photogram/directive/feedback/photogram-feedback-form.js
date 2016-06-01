(function () {
    'use strict';
    angular
        .module('app.photogram')
        .factory('PhotogramFeedbackForm', PhotogramFeedbackFormFactory);

    function PhotogramFeedbackFormFactory($translate) {

        var form = [{
            key: 'title',
            type: 'input',
            templateOptions: {
                type: 'text',
                placeholder: $translate.instant('FEEDBACK.TITLE'),
                required: true
            }
        }, {
            key: 'subject',
            type: 'select',
            templateOptions: {
                label: $translate.instant('FEEDBACK.SUBJECT'),
                options: [{
                    'label': $translate.instant('FEEDBACK.COMPLAINT'),
                    'id': 'complaint',
                }, {
                    'label': $translate.instant('FEEDBACK.BUG'),
                    'id': 'bug',
                }, {
                    'label': $translate.instant('FEEDBACK.SUGGESTION'),
                    'id': 'suggestion',
                }],
                valueProp: 'id',
                labelProp: 'label',
                icon: 'icon-list',
                iconPlaceholder: true
            }
        }, {
            key: 'status',
            type: 'textarea',
            templateOptions: {
                type: 'text',
                placeholder: $translate.instant('FEEDBACK.MESSAGE'),
                icon: 'ion-quote',
                required: true,
                iconPlaceholder: true
            }
        }];

        return {
            form: form
        };
    }


})();
