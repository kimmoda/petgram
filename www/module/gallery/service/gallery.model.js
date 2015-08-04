'use strict';
angular
    .module ('module.gallery')
    .factory ('Gallery', function ($http, $q, gettextCatalog, CacheFactory, Notify, Loading) {


    var form = [
        {
            key            : 'title',
            type           : 'input',
            templateOptions: {
                type           : 'text',
                placeholder    : gettextCatalog.getString ('Title'),
                icon           : 'icon-envelope',
                required       : true,
                iconPlaceholder: true
            }
        },
        {
            key            : 'geo',
            type           : 'toggle',
            templateOptions: {
                label      : gettextCatalog.getString ('Geolocalization'),
                toggleClass: 'positive'
            }
        }
    ];

    var formComment = [
        {
            key            : 'text',
            type           : 'textarea',
            templateOptions: {
                placeholder    : gettextCatalog.getString ('Text'),
                icon           : 'icon-envelope',
                required       : true,
                iconPlaceholder: true
            }
        }
    ];


    function all () {
        var defer = $q.defer ();
        Loading.show ();

        new Parse
            .Query ('Gallery')
            .descending ('createdAt')
            .include ('user')
            .find ()
            .then (function (resp) {
            var objs = [];
            angular.forEach (resp, function (obj) {
                obj.user = obj.get ('user');
                console.log (obj);

                objs.push ({
                    id     : obj.id,
                    data   : obj.attributes,
                    src    : obj.attributes.img._url,
                    created: obj.createdAt,
                    user   : obj.user.attributes
                });

            });
            Loading.hide ();
            defer.resolve (objs);
        });

        return defer.promise;
    }


    function get (item) {
        var defer = $q.defer ();

        console.log (item);
        Loading.show ();

        new Parse
            .Query ('Gallery')
            .include ('user')
            .get (item, function (resp) {
            console.log (resp);
            var obj     = resp.attributes;
            obj.id      = resp.id;
            obj.created = resp.createdAt;
            obj.user    = resp.get ('user').attributes;
            console.log (obj);
            defer.resolve (obj);
            Loading.hide ();
        });

        return defer.promise;
    }


    function add (_params) {
        var defer = $q.defer ();


        var ImageObject = Parse.Object.extend ('Gallery');


        if (_params.photo !== '') {

            console.log ('_params.photo ' + _params.photo);

            // create the parse file
            var imageFile = new Parse.File ('mypic.jpg', {base64: _params.photo});

            // save the parse file
            return imageFile.save ().then (function () {

                _params.photo = null;

                // create object to hold caption and file reference
                var imageObject = new ImageObject ();

                // set object properties
                imageObject.set ('title', _params.title);
                imageObject.set ('img', imageFile);
                imageObject.set ('like', 0);
                imageObject.set ('user', Parse.User.current ());
                // imageObject.set ('location', new Parse.GeoPoint (_params.coords.latitude, _params.coords.longitude));

                // save object to parse backend
                imageObject
                    .save (function (resp) {
                    defer.resolve (resp);
                });


            }, function (error) {
                console.log ('Error');
                console.log (error);
            });

        } else {
            // create object to hold caption and file reference
            var imageObject = new ImageObject ();

            // set object properties
            imageObject.set ('caption', _params.caption);

            // save object to parse backend
            return imageObject.save ();

        }


        return defer.promise;
    }

    function allComment (galleryId) {
        var defer = $q.defer ();
        new Parse
            .Query ('GalleryComment')
            .equalTo ('galleryId', galleryId)
            .include ('commentBy')
            .descending ('createdAt')
            .find()
            .then (function (resp) {
            var objs = [];
            angular.forEach (resp, function (item) {
                var obj  = item.attributes;
                obj.id   = item.id;
                obj.user = item.attributes.commentBy.attributes;
                objs.push (obj);
            });
            Loading.hide ();
            defer.resolve (objs);
        });
        return defer.promise;
    }

    function addComment (form) {
        var defer  = $q.defer ();
        var Object = Parse.Object.extend ('GalleryComment');
        var item   = new Object ();

        angular.forEach (form, function (value, key) {
            item.set (key, value);
        });
        item.set ('commentBy', Parse.User.current ());
        item.save (null)
            .then (function (resp) {
            console.log (resp);
            defer.resolve (resp);
        });

        return defer.promise;
    }

    return {
        all        : all,
        add        : add,
        get        : get,
        addComment : addComment,
        allComment : allComment,
        form       : form,
        formComment: formComment
    };

});
