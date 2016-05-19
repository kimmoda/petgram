(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name facebookLogin
     *
     * @description
     * _Please update the description and restriction._
     *
     * @restrict A
     * */

    angular
        .module('app.photogram')
        .directive('facebookLogin', facebookLoginDirective);

    function facebookLoginDirective(Loading, User, $state, AppConfig, Notify) {
        return {
            restrict: 'A',
            link: facebookLoginLink,
            template: ''
        };

        function facebookLoginLink(scope, elem, attr) {
            elem.bind('click', facebookLogin);

            function facebookLogin() {
                Loading.start();
                User
                    .facebookLogin()
                    .then(function (resp) {
                        console.log(resp);

                        Loading.end();
                        switch (resp.status) {
                            case 0:
                                // logado
                                $state.go(AppConfig.routes.home, {
                                    clear: true
                                });
                                break;
                            case 1:
                                // novo user
                                $state.go('useravatar', {
                                    clear: true
                                });
                                break;
                            case 2:
                                // merge
                                $state.go('usermerge', {
                                    clear: true
                                });
                                break;
                        }
                    })
                    .catch(function () {
                        Loading.end();
                        Notify.alert({
                            title: 'Ops',
                            text: ('Facebook error')
                        });
                    });
            }

        }
    }

})();