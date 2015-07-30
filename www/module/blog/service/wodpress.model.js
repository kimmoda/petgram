'use strict';
angular
    .module ('module.blog')
    .factory ('Wordpress', function ($http, $q, CacheFactory, CONST) {
    // Factory usando o plugin JSON API do Wordpress
    // https://wordpress.org/plugins/json-api/other_notes/
    // URL do Wordpres no qual irá fazer as requisições


    if (!CacheFactory.get ('blogCache')) {
        CacheFactory.createCache ('blogCache', {
            deleteOnExpire: 'aggressive',
            recycleFreq   : 60000
        });
    }

    var blogCache = CacheFactory.get ('blogCache');


    function getPage (limit, page) {
        var defer = $q.defer ();
        $http ({
            method: 'GET',
            url   : CONST.WORDPRESS + 'get_posts/?count=' + limit + "&page=" + page
        }).success (function (resp) {
            defer.resolve (resp);
        }).error (function (resp) {
            defer.reject (resp);
        });

        return defer.promise;
    };

    // Métodos de Retorno
    function getInfo () {
        var defer = $q.defer ();
        $http ({
            method: 'GET',
            url   : CONST.WORDPRESS + 'info/'
        }).success (function (resp) {
            defer.resolve (resp);
        }).error (function (resp) {
            defer.reject (resp);
        });

        return defer.promise;
    }

    function getRecent (limit, page) {
        var defer = $q.defer ();
        $http ({
            method: 'GET',
            url   : CONST.WORDPRESS + 'get_recent_posts/?count=' + limit + "&page=" + page
        }).success (function (resp) {
            defer.resolve (resp);
        }).error (function (resp) {
            defer.reject (resp);
        });

        return defer.promise;
    }

    function getPosts (limit, page) {
        var defer = $q.defer ();
        $http ({
            method: 'GET',
            url   : CONST.WORDPRESS + 'get_posts/?count=' + limit + "&page=" + page,
            cache : blogCache
        }).success (function (resp) {
            defer.resolve (resp);
        }).error (function (resp) {
            defer.reject (resp);
        });

        return defer.promise;
    }

    function getDate (date, limit, page) {
        var defer = $q.defer ();
        $http ({
            method: 'GET',
            url   : CONST.WORDPRESS + 'get_date_posts/?date=' + date + '&count=' + limit + "&page=" + page
        }).success (function (resp) {
            defer.resolve (resp);
        }).error (function (resp) {
            defer.reject (resp);
        });

        return defer.promise;
    }

    function getPost (id) {
        var defer = $q.defer ();
        $http ({
            method: 'GET',
            url   : CONST.WORDPRESS + 'get_post&id=' + id,
            cache : blogCache
        }).success (function (resp) {
            defer.resolve (resp);
        }).error (function (resp) {
            defer.reject (resp);
        });

        return defer.promise;
    }

    function getPostSlug (slug) {
        var defer = $q.defer ();
        $http ({
            method: 'GET',
            url   : CONST.WORDPRESS + 'get_post/?post_slug=' + slug
        }).success (function (resp) {
            defer.resolve (resp);
        }).error (function (resp) {
            defer.reject (resp);
        });

        return defer.promise;
    }

    function getPage (id) {
        var defer = $q.defer ();
        $http ({
            method: 'GET',
            url   : CONST.WORDPRESS + 'get_page/?page_id=' + id
        }).success (function (resp) {
            defer.resolve (resp);
        }).error (function (resp) {
            defer.reject (resp);
        });

        return defer.promise;
    }

    function getPageSlug (slug) {
        var defer = $q.defer ();
        $http ({
            method: 'GET',
            url   : CONST.WORDPRESS + 'get_page/?page_slug=' + slug
        }).success (function (resp) {
            defer.resolve (resp);
        }).error (function (resp) {
            defer.reject (resp);
        });

        return defer.promise;
    }

    function getCategory (id) {
        var defer = $q.defer ();
        $http ({
            method: 'GET',
            url   : CONST.WORDPRESS + 'get_category_posts/?category_id=' + id
        }).success (function (resp) {
            defer.resolve (resp);
        }).error (function (resp) {
            defer.reject (resp);
        });

        return defer.promise;
    }

    function categorySlug (slug) {
        var defer = $q.defer ();
        $http ({
            method: 'GET',
            url   : CONST.WORDPRESS + 'get_category_posts/?category_slug=' + slug
        }).success (function (resp) {
            defer.resolve (resp);
        }).error (function (resp) {
            defer.reject (resp);
        });

        return defer.promise;
    }

    function getTag (id) {
        var defer = $q.defer ();
        $http ({
            method: 'GET',
            url   : CONST.WORDPRESS + 'get_tag_posts/?tag_id=' + id
        }).success (function (resp) {
            defer.resolve (resp);
        }).error (function (resp) {
            defer.reject (resp);
        });

        return defer.promise;
    }

    function getTagSlug (slug) {
        var defer = $q.defer ();
        $http ({
            method: 'GET',
            url   : CONST.WORDPRESS + 'get_tag_posts/?tag_slug=' + slug
        }).success (function (resp) {
            defer.resolve (resp);
        }).error (function (resp) {
            defer.reject (resp);
        });

        return defer.promise;
    }

    function getAuthor (id) {
        var defer = $q.defer ();
        $http ({
            method: 'GET',
            url   : CONST.WORDPRESS + 'get_author_posts/?author_id=' + id
        }).success (function (resp) {
            defer.resolve (resp);
        }).error (function (resp) {
            defer.reject (resp);
        });

        return defer.promise;
    }

    function getAuthorSlug (slug) {
        var defer = $q.defer ();
        $http ({
            method: 'GET',
            url   : CONST.WORDPRESS + 'get_author_posts/?tag_slug=' + slug
        }).success (function (resp) {
            defer.resolve (resp);
        }).error (function (resp) {
            defer.reject (resp);
        });

        return defer.promise;
    }

    function getSearch (search, limit, page) {
        var defer = $q.defer ();
        $http ({
            method: 'GET',
            url   : CONST.WORDPRESS + 'get_search_results/?search=' + search + '&count=' + limit + "&page=" + page
        }).success (function (resp) {
            defer.resolve (resp);
        }).error (function (resp) {
            defer.reject (resp);
        });

        return defer.promise;
    }

    function getCategories () {
        var defer = $q.defer ();
        $http ({
            method: 'GET',
            url   : CONST.WORDPRESS + 'get_category_index'
        }).success (function (resp) {
            defer.resolve (resp);
        }).error (function (resp) {
            defer.reject (resp);
        });

        return defer.promise;
    }

    return {
        search    : getSearch,
        page      : getPage,
        info      : getInfo,
        recent    : getRecent,
        posts     : getPosts,
        date      : getDate,
        post      : getPost,
        postSlug  : getPostSlug,
        categories: getCategories,
        category  : getCategory,
        slug      : getPostSlug,
        author    : getAuthor,
        authorSlug: getAuthorSlug
    };
});