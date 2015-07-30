'use strict';
angular
    .module ('module.blog')
    .config (function ($stateProvider) {
    $stateProvider

        .state ('app.blog', {
        url  : '/blog',
        views: {
            menuContent: {
                controller : 'BlogPostsCtrl as BlogPosts',
                templateUrl: 'module/blog/view/blog.posts.html'
            }
        }
    })

        .state ('app.blogPost', {
        url  : '/post/:id',
        views: {
            menuContent: {
                resolve    : {
                    post: function ($stateParams, Wordpress) {
                        return Wordpress
                            .post ($stateParams.id)
                            .then (function (resp) {
                            return resp.post;
                        });
                    }
                },
                templateUrl: 'module/blog/view/blog.post.html',
                controller : 'BlogPostCtrl as BlogPost'
            }
        }
    })

        .state ('app.blog.category', {
        url  : '/category',
        views: {
            tabNews: {
                controller : 'BlogPostsCtrl as BlogPosts',
                templateUrl: 'module/blog/view/blog.posts.html'
            }
        }
    })


})
;

