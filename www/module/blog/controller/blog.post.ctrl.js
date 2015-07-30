'use strict';
angular
    .module ('module.blog')
    .controller ('BlogPostCtrl', function ($scope, post) {
    var self  = this;

    console.log (post);
    self.data = post;

    self.sharePost = function (link) {
        window.plugins.socialsharing.share ('Check this post here: ', null, null, link);
    };

});