(function (window, angular, undefined) {
    'use strict';

    /**
     * @ngdoc directive
     * @name userAvatar
     *
     * @description
     * _Please update the description and restriction._
     *
     * @restrict A
     * */

    angular
        .module('app.user')
        .directive('userAvatar', userAvatarDirective);

    function userAvatarDirective (PhotoService, User) {
        return {
            restrict: 'A',
            scope: {
                gallery: '@'
            },
            template: '',
            link: function ($scope, elem, attr) {

                elem.bind('click', openModal);

                function openModal () {

                    PhotoService
                        .open()
                        .then(function (imageData) {
                            User
                                .updateAvatar(imageData)
                                .then(function (resp) {
                                    console.log(resp);
                                });
                        })
                        .catch(function (resp) {
                            console.log(resp);
                        });
                }

            }
        }
    }

}) (window, window.angular);