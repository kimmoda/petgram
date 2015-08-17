//(function(){
//    'use strict';
//    angular
//        .module ('ionic.loading')
//        .config (function ($httpProvider) {
//        $httpProvider.interceptors.push ('loadingInterceptor');
//    })
//        .factory ('loadingInterceptor', function (Loading, $q) {
//        var numLoadings = 0;
//
//        function request (config) {
//            numLoadings++;
//            Loading.show ();
//            return config || $q.when (config);
//        }
//
//        function response (response) {
//            if (--numLoadings === 0) {
//                Loading.hide ();
//            }
//            return response || $q.when (response);
//        }
//
//        function responseError (response) {
//            if (--numLoadings === 0) {
//                Loading.hide ();
//            }
//            return $q.reject (response);
//        }
//
//        return {
//            request      : request,
//            response     : response,
//            responseError: responseError
//        };
//    });
//
//})();