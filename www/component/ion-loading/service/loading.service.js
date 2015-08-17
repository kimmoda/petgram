(function(){
    'use strict';
    angular
        .module ('ionic.loading')
        .factory ('Loading', function ($rootScope, $timeout) {

            var seconds = 2;

            function showLoading () {
                $rootScope.$broadcast ('loading:show');
            }

            function hideLoading () {
                $timeout (function () {
                    $rootScope.$broadcast ('loading:hide');
                }, parseInt (seconds + '000'));
            }

            return {
                show: showLoading,
                hide: hideLoading
            }
        }
    );
})();