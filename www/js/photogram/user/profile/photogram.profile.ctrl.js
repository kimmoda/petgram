(function (window, angular, undefined) {
    'use strict';
    angular
        .module('app.photogram')
        .controller('PhotogramProfileCtrl', PhotogramProfileCtrl);

    function PhotogramProfileCtrl($stateParams, Photogram) {
        var vm = this;
        init();

        function init() {
            Photogram
                .getUser($stateParams.id)
                .then(function (resp) {
                    vm.form = resp;
                });
        }
    }

})(window, window.angular);