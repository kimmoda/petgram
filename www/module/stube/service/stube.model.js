'use strict';
angular
    .module ('module.stube')
    .factory ('Stube', function ($http, $q, $window, $timeout, $ionicModal, $rootScope, Notify, Loading, gettextCatalog, CacheFactory) {

    var REDTUBE_API = 'http://cors-server.getup.io/url/api.redtube.com/';
    // Cache
    var settingsCache,
        historyCache,
        favorityCache;

    if (!CacheFactory.get ('settings')) {
        settingsCache = CacheFactory.createCache ('settings', {
            storageMode: 'localStorage' // This cache will use `localStorage`.
        });
    }

    if (!CacheFactory.get ('history')) {
        historyCache = CacheFactory.createCache ('history', {
            storageMode: 'localStorage' // This cache will use `localStorage`.
        });
    }

    if (!CacheFactory.get ('favority')) {
        favorityCache = CacheFactory.createCache ('favority', {
            storageMode: 'localStorage' // This cache will use `localStorage`.
        });
    }

    var data = {
        params    : {
            search   : '',
            category : '',
            stars    : '',
            thumbsize: 'big',
            ordering : 'newest',
            period   : '',
            page     : 0
        },
        options   : {
            autoplay : settingsCache.get ('autoPlay') || true,
            repeat   : settingsCache.get ('repeat') || true,
            interval : settingsCache.get ('interval') || 1000,
            showPager: settingsCache.get ('showPager') || true

        },
        loading   : false,
        video     : {},
        categories: [],
        tags      : [],
        pornStars : [],
        history   : [],
        favs      : [],
        results   : []
    };


    function init () {

        if (getSetting ('autoPlay') === undefined) {
            setSettting ('autoPlay', true);
            setSettting ('showPager', false);
            setSettting ('repeat', true);
            setSettting ('interval', 1500);
        }

        angular.forEach (historyCache.keys (), function (item) {
            data.history.push (historyCache.get (item));
        });

        angular.forEach (favorityCache.keys (), function (item) {
            data.favs.push (favorityCache.get (item));
        });

    }

    function addVideo (video) {
        var tags = [];
        angular.forEach (video.tags, function (tag) {
            console.log (tag);
            tags.push (tag);
        });

        video.tags = tags;
    }

    // Settings
    function getSetting (key) {
        return settingsCache.get (key);
    }

    function setSettting (key, value) {
        data.options[key] = value;
        settingsCache.put (key, value);
    }

    // History
    function addHistory (video) {
        var pos     = data.history.indexOf (video);
        video.added = new Date ();

        if (pos < 0) {
            data.history.push (video);
        } else {
            data.history[pos] = video;
        }
        historyCache.put (video.video_id, video);
    }

    function removeHistory (video) {
        var index = data.history.indexOf (video);
        data.history.splice (index, 1);
        historyCache.remove (video);
    }

    function cleanHistory () {
        data.history = [];
        historyCache.removeAll ();
    }


    // History
    function getFavority (video) {
        console.log (video);
        var pos = favorityCache.get (video.video_id);
        if (pos) {
            return true
        } else {
            return false;
        }
    }

    function toggleFavority (video) {
        var cache = favorityCache.get (video.video_id);

        if (cache) {
            var index = data.favs.indexOf (video);
            data.favs.splice (index, 1);

            favorityCache.remove (video.video_id);
            console.log (data.favs);
            Notify.alert ('Favoritos', 'Video removido');
            return false;
        } else {
            video.added = new Date ();
            data.favs.push (video);
            favorityCache.put (video.video_id, video);
            console.log (data.favs);
            Notify.alert ('Favoritos', 'Video adicionado');
            return true;
        }

    }

    function removeFavority (video) {
        var index = data.favs.indexOf (video);
        data.favs.splice (index, 1);
        favorityCache.remove (video);
    }

    function cleanFavority () {
        data.favs = [];
        favorityCache.removeAll ();
    }


    function getVideoById (id) {
        var defer = $q.defer ();
        $http ({
            method: 'GET',
            url   : REDTUBE_API + '?data=stube.Videos.getVideoById' + getParams () + '&video_id=' + id
        })
            .success (function (resp) {
            defer.resolve (resp.video);
        })
            .error (function (err) {
            defer.reject (err);
        });

        return defer.promise;
    }

    function getVideo () {
        return video;
    }

    function getData () {
        return data;
    }

    function setVideo (video) {
        data.video = video;
    }

    function getParams () {
        var result = '';
        angular.forEach (data.params, function (value, key) {
            if (value !== '') {
                result += '&' + key + '=' + value
            }
        });
        return result;
    }

    function setParams (name, newValue) {
        var result  = {};
        angular.forEach (data.params, function (value, key) {
            console.log (key, value);
            if (name === key) {
                result[key] = newValue;
            } else {
                result[key] = value;
            }
        });
        data.params = result;
    }


    function searchVideos (text, more) {
        var defer          = $q.defer ();
        data.params.search = text;

        if (more) {
            data.params.page++;
        } else {
            Loading.show ();
            data.results     = [];
            data.params.page = 0;
        }

        $http ({
            method: 'GET',
            url   : REDTUBE_API + '?data=stube.Videos.searchVideos' + getParams ()
        })
            .success (function (resp) {
            angular.forEach (resp.videos, function (item) {
                data.results.push (item.video);
            });

            Loading.hide ();
            //Notify.keyboardHide ();
            defer.resolve (data.results);
        })
            .error (function (err) {
            Notify.loadingHide ();
            Notify.keyboardHide ();
            defer.reject (err);
        });

        return defer.promise;
    }

    function getCategoriesList () {
        var defer = $q.defer ();

        $http ({
            method: 'GET',
            url   : REDTUBE_API + '?data=stube.Categories.getCategoriesList' + getParams (),
            cache : true

        })
            .success (function (resp) {
            defer.resolve (resp.categories);
        })
            .error (function (err) {
            defer.reject (err);
        });

        return defer.promise;
    }


    function getTagList (page) {
        var defer = $q.defer ();

        $http ({
            method: 'GET',
            url   : REDTUBE_API + '?data=stube.Tags.getTagList' + getParams (),
            cache : true
        })
            .success (function (resp) {
            defer.resolve (resp);
        })
            .error (function (err) {
            defer.reject (err);
        });

        return defer.promise;
    }

    function getStarList () {
        var defer      = $q.defer ();
        var starsCache = loadMoreVideos.get ('stars');

        if (starsCache) {
            defer.resolve (starsCache);
        } else {
            $http ({
                method: 'GET',
                url   : REDTUBE_API + '?data=stube.Stars.getStarList' + getParams ()
            })
                .success (function (resp) {
                localStorageService.set ('stars', resp);
                defer.resolve (resp)
            })
                .error (function (err) {
                defer.reject (err);
            });
        }


        return defer.promise;
    }

    function getStarDetailedList () {
        var defer      = $q.defer ();
        var starsCache = localStorageService.get ('stars');

        if (starsCache) {
            defer.resolve (starsCache);
        } else {
            $http ({
                method: 'GET',
                url   : REDTUBE_API + '?data=stube.Stars.getStarDetailedList' + getParams ()
            })
                .success (function (resp) {
                defer.resolve (resp.stars)
            })
                .error (function (err) {
                defer.reject (err);
            });
        }

        return defer.promise;

    }

    function isVideoActive (video, page) {
        $http.get (REDTUBE_API + '?data=stube.Videos.isVideoActive&video_id=' + getParams () + '&video_id=' + video)
            .success (function (resp) {
            data.results = resp;
        });
    }


    function getVideoEmbedCode (video) {

        console.log (video);
        var defer = $q.defer ();
        $http.get (REDTUBE_URL + video)
            .success (function (resp) {

            $timeout (function () {
                var element  = angular.element (resp);
                var element2 = angular.element (element.contents ().find ('noscript').eq (0).text ());
                var video1   = element2.contents ().find ('source').attr ('src');


                console.log (video1);

                defer.resolve (video1);

            }, 1000);


        })
            .error (function (err) {
            defer.reject (err);
        });

        return defer.promise;
    }


    var categories = [
        {
            "category": gettextCatalog.getString ('amateur')
        },
        {
            "category": gettextCatalog.getString ('anal')
        },
        {
            "category": gettextCatalog.getString ('asian')
        },
        {
            "category": gettextCatalog.getString ('bigtits')
        },
        {
            "category": gettextCatalog.getString ('blonde')
        },
        {
            "category": gettextCatalog.getString ('blowjob')
        },
        {
            "category": gettextCatalog.getString ('creampie')
        },
        {
            "category": gettextCatalog.getString ('cumshot')
        },
        {
            "category": gettextCatalog.getString ('doublepenetration')
        },
        {
            "category": gettextCatalog.getString ('ebony')
        },
        {
            "category": gettextCatalog.getString ('facials')
        },
        {
            "category": gettextCatalog.getString ('fetish')
        },
        {
            "category": gettextCatalog.getString ('gangbang')
        },
        {
            "category": gettextCatalog.getString ('gay')
        },
        {
            "category": gettextCatalog.getString ('group')
        },
        {
            "category": gettextCatalog.getString ('hd')
        },
        {
            "category": gettextCatalog.getString ('hentai')
        },
        {
            "category": gettextCatalog.getString ('interracial')
        },
        {
            "category": gettextCatalog.getString ('japanese')
        },
        {
            "category": gettextCatalog.getString ('japanesecensored')
        },
        {
            "category": gettextCatalog.getString ('latina')
        },
        {
            "category": gettextCatalog.getString ('lesbian')
        },
        {
            "category": gettextCatalog.getString ('lingerie')
        },
        {
            "category": gettextCatalog.getString ('masturbation')
        },
        {
            "category": gettextCatalog.getString ('mature')
        },
        {
            "category": gettextCatalog.getString ('milf')
        },
        {
            "category": gettextCatalog.getString ('pov')
        },
        {
            "category": gettextCatalog.getString ('public')
        },
        {
            "category": gettextCatalog.getString ('redhead')
        },
        {
            "category": gettextCatalog.getString ('shemale')
        },
        {
            "category": gettextCatalog.getString ('squirting')
        },
        {
            "category": gettextCatalog.getString ('teens')
        },
        {
            "category": gettextCatalog.getString ('vintage')
        },
        {
            "category": gettextCatalog.getString ('wildcrazy')
        }
    ];

    return {
        init: init,

        setting     : getSetting,
        setSettting : setSettting,
        getData     : getData,
        getVideo    : getVideo,
        addVideo    : addVideo,
        // Search
        searchVideos: searchVideos,

        // Open Video
        getVideoById: getVideoById,

        // History
        addHistory   : addHistory,
        removeHistory: removeHistory,
        cleanHistory : cleanHistory,

        // Favority
        getFavority   : getFavority,
        removeFavority: removeFavority,
        cleanFavority : cleanFavority,
        toggleFavority: toggleFavority,

        setVideo           : setVideo,
        getParams          : getParams,
        setParams          : setParams,
        getCategoriesList  : getCategoriesList,
        getTagList         : getTagList,
        getStarList        : getStarList,
        getStarDetailedList: getStarDetailedList,
        isVideoActive      : isVideoActive,
        getVideoEmbedCode  : getVideoEmbedCode
    };

});