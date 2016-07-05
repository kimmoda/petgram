(function () {
    'use strict';
    angular
        .module('app.main')
        .factory('UserForm', UserFormFactory);

    function UserFormFactory($translate) {

        return {
            login   : login(),
            register: register(),
            profile : profile()
        };

        function login() {
            return [{
                type           : 'input',
                key            : 'username',
                templateOptions: {
                    type           : 'text',
                    placeholder    : $translate.instant('username'),
                    icon           : 'icon-user',
                    required       : true,
                    iconPlaceholder: true
                }
            }, {
                type           : 'input',
                key            : 'password',
                templateOptions: {
                    type           : 'password',
                    placeholder    : $translate.instant('password'),
                    icon           : 'icon-lock',
                    required       : true,
                    iconPlaceholder: true
                }
            }];
        }

        function register() {
            return [
                {
                    type           : 'input',
                    key            : 'username',
                    templateOptions: {
                        type           : 'text',
                        placeholder    : $translate.instant('username'),
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
                        placeholder    : $translate.instant('email'),
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
                        placeholder    : $translate.instant('password'),
                        icon           : 'icon-lock',
                        required       : true,
                        iconPlaceholder: true
                    }
                }];
        }

        function profile() {
            return [
                {
                    key            : 'username',
                    type           : 'input',
                    templateOptions: {
                        type           : 'text',
                        placeholder    : $translate.instant('username'),
                        icon           : 'icon-ios-at',
                        required       : true,
                        iconPlaceholder: true
                    }
                },
                {
                    key            : 'name',
                    type           : 'input',
                    templateOptions: {
                        type           : 'text',
                        placeholder    : $translate.instant('name'),
                        icon           : 'icon-user',
                        required       : true,
                        iconPlaceholder: true
                    }
                }, {
                    key            : 'status',
                    type           : 'input',
                    templateOptions: {
                        type           : 'text',
                        placeholder    : $translate.instant('status'),
                        icon           : 'ion-quote',
                        required       : true,
                        iconPlaceholder: true
                    }
                }, {
                    type           : 'select',
                    key            : 'gender',
                    templateOptions: {
                        label          : $translate.instant('gender'),
                        options        : [{
                            'label': $translate.instant('man'),
                            'id'   : 'male',
                        }, {
                            'label': $translate.instant('woman'),
                            'id'   : 'female',
                        }],
                        valueProp      : 'id',
                        labelProp      : 'label',
                        //icon           : 'ion-ios-body-outline',
                        //iconPlaceholder: true
                    }
                }];
        }

    }


})();
