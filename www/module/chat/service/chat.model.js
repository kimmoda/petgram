'use strict';
angular
    .module ('module.chat')
    .factory ('Chat', function ($http, $q, Loading) {

        var data = {
            currentUser: Parse.User.current (),
            users      : [],
            messages   : []
        };


        function get () {
            return data;
        }

        function getFromMessages (toUser) {
            var defer    = $q.defer ();
            var messages = [];
            new Parse
                .Query ('Chat')
                .include ('User')
                .equalTo ('sender', data.currentUser)
                //.equalTo ('receiver', toUser)
                .descending ('createdAt')
                .limit (10)
                .find ()
                .then (function (resp) {

                angular.forEach (resp, function (item) {

                    var message = {
                        id      : item.id,
                        text    : item.attributes.message,
                        userId  : data.currentUser.id,
                        date    : item.createdAt,
                        sender  : item.get ('sender'),
                        receiver: item.get ('receiver'),
                        type    : 'from'
                    };
                    console.warn (item, message);
                    messages.push (message);
                });

                defer.resolve (messages);
            });
            return defer.promise;
        }

        function getToMessages (toUser) {
            var defer    = $q.defer ();
            var messages = [];
            new Parse
                .Query ('Chat')
                .equalTo ('sender', toUser.id)
                .equalTo ('receiver', data.currentUser.id)
                .descending ('createdAt')
                .limit (10)
                .find ()
                .then (function (resp) {
                angular.forEach (resp, function (item) {
                    var obj     = item.attributes;
                    var message = {
                        id       : item.id,
                        text     : obj.body,
                        userId   : obj.from_user,
                        date     : obj.createdAt,
                        read     : obj.status,
                        from     : obj.from_user,
                        to       : obj.to_user,
                        type     : 'form',
                        createdAt: item.createdAt
                    };
                    messages.push (message);
                });
                defer.resolve (messages);
            });
            return defer.promise;
        }

        function getMessages (toUser) {
            var promises = [];
            promises.push (getFromMessages (toUser));
            //promises.push (getToMessages (toUser));

            return $q.all (promises);
        }

        function messages (toUser) {
            var defer = $q.defer ();
            getMessages (toUser)
                .then (function (resp) {
                console.log (resp);
                data.messages = [];
                angular.forEach (resp[0], function (item) {
                    data.messages.push (item);
                });
                angular.forEach (resp[1], function (item) {
                    data.messages.push (item);
                });
                console.log (data);
                defer.resolve (data);
            });
            return defer.promise;

        }

        function send (user, form) {
            var defer = $q.defer ();
            var Obj   = Parse.Object.extend ('Chat');
            var obj   = new Obj ();
            obj.set ('sender', data.currentUser.id);
            obj.set ('receiver', user);
            obj.set ('message', form.body);
            obj.set ('status', false);
            obj.save ();
            defer.resolve (obj);
            return defer.promise;
        }

        return {
            get     : get,
            send    : send,
            messages: messages
        };
    }
);