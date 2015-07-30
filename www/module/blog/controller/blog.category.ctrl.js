'use strict';
angular
    .module ('module.blog')
    .controller ('BlogCategoryCtrl', function ($scope, $stateParams, Wordpress) {
    var self = this;
    Wordpress
        .category ($stateParams.id)
        .then (function (data) {
        self.posts = data.blog.posts;
    });
});
