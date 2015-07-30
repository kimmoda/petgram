'use strict';
angular.module ('module.blog')
    .controller ('BlogTagCtrl', function ($scope, $stateParams, Wordpress) {
    var self = this;
    Wordpress
        .tag ($stateParams.id)
        .success (function (data, status) {
        self.posts = data;
    });
});