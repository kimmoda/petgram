'use strict';
angular
    .module ('module.contact')
    .factory ('Contact', function ($http, $q, $cordovaContacts) {

    var data = {
        contatcts: []
    };

    function get (contact) {
        return data.contatcts.filter (function (item) {
            return contact.id == item.id;
        });
    }

    function find (name) {
        var defer = $q.defer ();

        if (window.cordova) {
            if (data.contatcts.length) {
                defer.resolve (data.contatcts);
            } else {
                var options      = {};
                options.filter   = name;
                options.multiple = true;

                $cordovaContacts
                    .find (options)
                    .then (function (resp) {
                    angular.forEach (resp, function (item) {
                        data.contatcts.push (item);
                    });
                    defer.resolve (resp);
                });
            }
        } else {
            defer.reject ('Not supported');
        }

        return defer.promise;
    }

    function create (contact) {
        var defer = $q.defer ();
        $cordovaContacts.save ({"displayName": "Steve Jobs"}).then (function (result) {
            console.log (JSON.stringify (result));
        }, function (error) {
            console.log (error);
        });

        return defer.promise;
    }

    function remove (contact) {
        var defer = $q.defer ();
        $cordovaContacts.remove ({"displayName": "Steve Jobs"}).then (function (result) {
            console.log (JSON.stringify (result));
        }, function (error) {
            console.log (error);
        });
        return defer.promise;

    }

    return {
        get   : get,
        find  : find,
        create: create,
        remove: remove
    };

});