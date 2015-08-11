'use strict';
angular
    .module ('module.feedback')
    .factory ('Feedback', function ($http, $q, $timeout, Parse, Notify) {

        function submit (form) {
            Notify.showLoading ();
            var defer          = $q.defer ();
            var SugestaoObject = Parse.Object.extend ('Feedback');
            var sugestao       = new SugestaoObject ();

            angular.forEach (form, function (value, key) {
                sugestao.set (key, value);
            });

            sugestao.save (null, {});

            $timeout (function () {
                Notify.hideLoading ();
                defer.resolve (sugestao);
            }, 1500);

            return defer.promise;
        }

        return {
            submit: submit
        }


    }
);