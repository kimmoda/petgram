'use strict';
angular
    .module ('module.feedback')
    .config (function ($stateProvider) {
    $stateProvider

        .state ('app.feedback', {
        url  : '/feedback',
        views: {
            menuContent: {
                templateUrl: 'module/feedback/view/feedback.form.html',
                controller : 'FeedbackCtrl as Feedback'
            }
        }
    })


});
