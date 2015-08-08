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
            type           : 'input',
            templateOptions: {
                placeholder: gettextCatalog.getString ('Add your comment'),
                type       : 'text',
                required   : true,
                //icon           : 'icon-envelope',
                //iconPlaceholder: true
            }
        }
    ];

    var currentUser = Parse.User.current ();


    function add (_params) {
        var defer = $q.defer ();

        Notify.showLoading ();

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
                    Notify.hideLoading ();
                    defer.resolve (resp);
                });


            }, function (error) {
                defer.reject(error);
                Notify.hideLoading ();
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

        var gallery = new Parse
            .Query ('Gallery')
            .get (galleryId, function (resp) {
            console.log (resp);
            return resp;
        });

        new Parse
            .Query ('GalleryComment')
            .equalTo ('galery', gallery)
            //.include ('commentBy')
            .descending ('createdAt')
            .find ()
            .then (function (resp) {
            var objs = [];
            angular.forEach (resp, function (item) {
                var obj  = item.attributes;
                obj.id   = item.id;
                obj.user = item.attributes.commentBy;
                objs.push (obj);
            });
            Loading.hide ();
            defer.resolve (objs);
        });
        return defer.promise;
    }

    function getComments (obj) {
        var defer = $q.defer ();

        new Parse
            .Query ('Gallery')
            .get (obj)
            .then (function (gallery) {
            new Parse
                .Query ('GalleryComment')
                .equalTo ('gallery', gallery)
                .include ('commentBy')
                .ascending ('createdAt')
                .find ()
                .then (function (resp) {
                var comments = [];
                angular.forEach (resp, function (item) {
                    console.warn (item);
                    var comment      = {
                        id     : item.id,
                        text   : item.attributes.text,
                        user   : item.attributes.commentBy.attributes,
                        created: item.createdAt
                    }
                    comment.user.img = (comment.user.img) ? comment.user.img : 'img/user.png';
                    comments.push (comment);
                });
                defer.resolve (comments);
            });
        })

        return defer.promise;
    }

    function getLikes (obj) {
        var defer = $q.defer ();

        new Parse
            .Query ('Gallery')
            .get (obj)
            .then (function (gallery) {
            new Parse
                .Query ('GalleryLike')
                .equalTo ('gallery', gallery)
                .include ('user')
                .ascending ('createdAt')
                .find ()
                .then (function (resp) {
                var objs = [];
                angular.forEach (resp, function (item) {
                    console.warn (item);
                    var obj = {
                        id     : item.id,
                        text   : item.attributes.text,
                        user   : item.attributes.user.attributes,
                        created: item.createdAt
                    }
                    objs.push (obj);
                });
                console.log (objs);
                defer.resolve (objs);
            });
        })

        return defer.promise;
    }

    function galleryLiked (gallery) {
        var defer = $q.defer ();

        return defer.promise;
    }

    function search () {
        var defer = $q.defer ();
        var data  = [];

        new Parse
            .Query ('Gallery')
            .limit (20)
            .find ()
            .then (function (resp) {
            angular.forEach (resp, function (value, key) {
                var obj = {
                    id     : value.id,
                    item   : value.attributes,
                    src    : value.attributes.img.url (),
                    created: value.createdAt
                };
                data.push (obj);
            });
            defer.resolve (data);
        });

        return defer.promise;
    }

    /*
     * 1) Gallery, Limit
     * 2) GalleryComment, Limi
     * 3) Like, count, liked
     * */
    function all (page) {
        var defer        = $q.defer ();
        var limit        = 10;
        var limitComment = 3;
        var data         = new Array ();
        //Loading.show ();

        new Parse
            .Query ('Gallery')
            .descending ('createdAt')
            .include ('user')
            .limit (limit)
            .skip (page * limit)
            .find ()
            .then (function (resp) {

            var cb = _.after (resp.length, function () {
                defer.resolve (data);
                //return data;
            });

            _.each (resp, function (item) {
                //grab relations

                var likes    = item.relation ('likes');
                var comments = item.relation ('comments');

                likes
                    .query ()
                    .equalTo ('gallery', item)
                    .equalTo ('user', currentUser)
                    .count ()
                    .then (function (liked) {

                    likes
                        .query ()
                        .count ()
                        .then (function (likes) {

                        comments
                            .query ()
                            .include ('commentBy')
                            .descending ('createdAt')
                            .limit (limitComment)
                            .find ()
                            .then (function (comments) {
                            console.log (comments);

                            var commentsData = [];

                            angular.forEach (comments, function (item) {
                                var comment = {
                                    id  : item.id,
                                    text: item.attributes.text,
                                    user: item.attributes.commentBy.attributes
                                }
                                commentsData.push (comment);
                            });

                            var obj      = {
                                id      : item.id,
                                item    : item.attributes,
                                created : item.createdAt,
                                likes   : likes,
                                liked   : liked,
                                user    : item.attributes.user.attributes,
                                comments: commentsData
                            };
                            obj.user.img = (obj.user.img) ? obj.user.img : 'img/user.png';

                            data.push (obj);
                            cb ();
                        });
                    })
                })


            });


        });

        return defer.promise;
    }


    function getGallery (id) {
        var defer = $q.defer ();
        new Parse
            .Query ('Gallery')
            .include ('user')
            .get (id)
            .then (function (resp) {
            defer.resolve (resp);
        });
        return defer.promise;
    }

    function get (item) {
        var defer = $q.defer ();

        console.log (item);
        Loading.show ();

        getGallery (item)
            .then (function (resp) {
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


    function addComment (form) {
        var defer = $q.defer ();
        Notify.showLoading ();
        console.log (form);
        getGallery (form.galleryId)
            .then (function (gallery) {
            var Object = Parse.Object.extend ('GalleryComment');
            var item   = new Object ();

            angular.forEach (form, function (value, key) {
                item.set (key, value);
            });
            item.set ('commentBy', Parse.User.current ());
            item.set ('gallery', gallery);

            item.save (null)
                .then (function (resp) {
                console.log (resp);
                gallery
                    .relation ('comments')
                    .add (resp);

                gallery
                    .save ()
                    .then (function (resp) {
                    Notify.hideLoading ();
                    console.log (resp);
                    defer.resolve (resp);
                })
            });
        })


        return defer.promise;
    }

    function isLiked (galleryId) {
        var defer = $q.defer ();

        getGallery (galleryId)
            .then (function (gallery) {
            new Parse
                .Query ('GalleryLike')
                .equalTo ('gallery', gallery)
                .equalTo ('user', currentUser)
                .first ()
                .then (function (resp) {
                console.log (resp);
                if (resp === undefined) {
                    defer.resolve (true);
                } else {
                    defer.reject (true);
                }
            });
        })

        return defer.promise;
    }

    function addLike (galleryId) {
        var defer = $q.defer ();

        getGallery (galleryId)
            .then (function (gallery) {
            var Object = Parse.Object.extend ('GalleryLike');
            var item   = new Object ();

            angular.forEach (form, function (value, key) {
                item.set (key, value);
            });

            item.set ('user', Parse.User.current ());
            item.set ('gallery', gallery);

            item.save (null)
                .then (function (resp) {
                console.log (resp);
                gallery
                    .relation ('likes')
                    .add (resp);

                gallery
                    .save ()
                    .then (function (resp) {
                    console.log (resp);
                    defer.resolve (resp);
                })
            });
        })
        return defer.promise;
    }

    function likeGallery (gallery) {
        var defer = $q.defer ();
        isLiked (gallery)
            .then (function (resp) {
            console.log (resp);
            addLike (gallery)
                .then (function (resp) {
                defer.resolve (resp);
            });
        })
            .catch (function (err) {
            defer.reject (err);
        })
        return defer.promise;
    }

    function removeLike (gallery) {
        var defer = $q.defer ();
        getGallery (gallery)
            .then (function (gallery) {
            var Object = Parse.Object.extend ('GalleryLike');
            var item   = new Object ();

            angular.forEach (form, function (value, key) {
                item.set (key, value);
            });

            item.set ('user', Parse.User.current ());
            item.set ('gallery', gallery);

            item.save (null)
                .then (function (resp) {
                console.log (resp);
                gallery
                    .relation ('likes')
                    .add (resp);

                gallery
                    .save ()
                    .then (function (resp) {
                    console.log (resp);
                    defer.resolve (resp);
                })
            });
        })
        return defer.promise;
    }

    return {
        all        : all,
        add        : add,
        get        : get,
        addComment : addComment,
        likeGallery: likeGallery,
        allComment : allComment,
        getComments: getComments,
        getLikes   : getLikes,
        search     : search,
        form       : form,
        formComment: formComment
    };

});
