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

            Loading.show ();

            var defer = $q.defer ();
            var cache = slideCache.keys ();

            if (cache.length > 0 && !force === true && force !== undefined) {
                console.log ('Request Cache');
                Loading.hide ();
                defer.resolve (slideCache.keys ());
            } else {

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

                        slideCache.put (item.id, obj);
                        results.push (obj);
                    });
                    defer.resolve (results);
                });
            }

            return defer.promise;
        }

        return {
            all: all
        }

    }
);  