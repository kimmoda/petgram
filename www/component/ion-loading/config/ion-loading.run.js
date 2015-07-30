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
})
    .config (function ($httpProvider) {
    $httpProvider.interceptors.push ('loadingInterceptor');
})
    .factory ('Loading', function ($rootScope) {
    function show () {
        $rootScope.$broadcast ('loading:show');
    }

    function hide () {
        $rootScope.$broadcast ('loading:hide');
    }

    return {
        show: show,
        hide: hide
    };
});