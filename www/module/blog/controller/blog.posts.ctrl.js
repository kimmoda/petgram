'use strict';
angular.module ('module.blog')
    .controller ('BlogPostsCtrl', function ($scope, $ionicActionSheet, $timeout, $state, $ionicScrollDelegate, $cordovaSocialSharing, Wordpress) {
        var currentPage = 0;
        var limitPost   = 5;
        var self        = this;

        self.data = {
            posts: []
        };

        function init () {
            currentPage++;
            Wordpress
                .posts (limitPost, currentPage)
                .then (function (data) {
                console.log (data);
                angular.forEach (data.posts, function (post) {
                    self.data.posts.push (post);
                });
                $scope.$broadcast ('scroll.infiniteScrollComplete');
            });
        };

        init ();

        self.loadMoreData = init;


        self.open = function (slug) {
            $state.go ('blog.post', {postId: slug})

        }

        self.share = function (title) {

            $cordovaSocialSharing
                .canShareVia (socialType, message, image, link)
                .then (function (result) {
                // Success!
            }, function (err) {
                // An error occurred. Show a message to the user
            });

        }
    }
);