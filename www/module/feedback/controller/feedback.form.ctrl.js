'use strict';
angular
    .module ('module.feedback')
    .controller ('FeedbackCtrl', function ($rootScope, Notify, Feedback, FeedbackForm) {
    var self = this;

    self.form = {
        user   : Parse.User.current ()
    };

    self.formFields = FeedbackForm.form;

    self.submitFeedback = function (rForm, data) {
        console.log (rForm, data);
        if (rForm.$valid) {
            var form = angular.copy (data);
            Feedback
                .submit (form)
                .then (function (resp) {
                console.log (resp);
                Notify.alert ('Success', 'Sugestão enviada com sucesso!')
            });
        }
    };
});