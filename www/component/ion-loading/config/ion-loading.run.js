(function(){
    'use strict';
    angular
        .module ('ionic.loading')
        .run (function ($rootScope, $ionicLoading) {
        //Loading
        $rootScope.$on ('loading:show', function () {
            $ionicLoading.show ();
        });
        $rootScope.$on ('loading:hide', function () {
            $ionicLoading.hide ();
        });
    });

})();