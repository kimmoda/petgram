'use strict';
angular
    .module ('module.core')
    .factory ('DashboardSlide', function ($http, $q, Loading, CacheFactory) {

        var cacheDashboardSlide;

        if (!CacheFactory.get ('DashboardSlide')) {
            cacheDashboardSlide = CacheFactory.createCache ('DashboardSlide', {
                //maxAge        : seconds * 1000, // Items added to this cache expire after 15 minutes.
                //deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
                storageMode: 'localStorage' // This cache will use `localStorage`.
            });
        }


        var slideCache = CacheFactory.get ('DashboardSlide');

        function all (force) {
            var defer = $q.defer();
            var objs = [];

            Loading.show ();
            new Parse
                .Query ('DashboardSlide')
                .find ()
                .then (function (resp) {
                var results = []
                angular.forEach (resp, function (item) {
                    var obj = {
                        id   : item.id,
                        name : item.attributes.name,
                        image: item.attributes.image
                    };

                    objs.push (obj);
                });
                Loading.hide ();
                defer.resolve (objs);
            });

            return defer.promise;
        }

        return {
            all: all
        }

    }
);
