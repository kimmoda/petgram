(function(){
    'use strict';
    angular
        .module('module.user')
        .factory('UserForm', function ($translate) {

            var login = [
                {
                    type           : 'input',
                    key            : 'email',
                    templateOptions: {
                        type           : 'email',
                        placeholder    : $translate.instant('EMAIL'),
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
                        placeholder    : $translate.instant('PASSWORD'),
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
                        placeholder    : $translate.instant('NAME'),
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
                        placeholder    : $translate.instant('EMAIL'),
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
                        placeholder    : $translate.instant('BIRTHDAY'),
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
                        placeholder    : $translate.instant('PASSWORD'),
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
                        placeholder    : $translate.instant('NAME'),
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
                        placeholder    : $translate.instant('STATUS'),
                        icon           : 'ion-quote',
                        required       : true,
                        iconPlaceholder: true
                    }
                },
                {
                    type           : 'select',
                    key            : 'gender',
                    templateOptions: {
                        label          : $translate.instant('GENDER'),
                        options        : [
                            {
                                'label': $translate.instant('MAN'),
                                'id'   : 'male',
                            },
                            {
                                'label': $translate.instant('WOMAN'),
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
                        placeholder    : $translate.instant('TELEPHONE'),
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
                        placeholder    : $translate.instant('SITE'),
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
                        placeholder    : $translate.instant('ADDRESS'),
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
                        placeholder    : $translate.instant('EMAIL'),
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
                        placeholder    : $translate.instant('BIRTHDAY'),
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
})();