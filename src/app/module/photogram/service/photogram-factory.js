(function () {
    'use strict';

    angular
        .module('app.photogram')
        .factory('Photogram', PhotogramFactory);

    function PhotogramFactory($q, Parse, User, Loading) {

        var limitComment = 3;

        return {
            // Feed
            feed: feed,
            feedGrid: feedGrid,
            post: post,
            get: get,
            deletePhoto: deletePhoto,
            find: find,
            nearby: nearby,
            // Activity
            addActivity: addActivity,
            listActivity: listActivity,
            // User
            getUserGallery: getUserGallery,
            getUserGalleryQtd: getUserGalleryQtd,
            // Comment
            allComment: allComment,
            addComment: addComment,
            getComments: getComments,
            updateComment: updateComment,
            deleteComment: deleteComment,
            // Like
            getLikes: getLikes,
            likeGallery: likeGallery,
            // Follow
            getFollow: getFollow,
            search: search
        };


        function deletePhoto(galleryId) {
            var defer = $q.defer();

            new Parse
                .Query('Gallery')
                .get(galleryId, function (resp) {
                    resp.destroy();
                    defer.resolve(resp);
                });

            return defer.promise;
        }

        function post(_params) {
            var defer       = $q.defer();
            var ImageObject = Parse.Object.extend('Gallery');

            if (_params.photo !== '') {

                // create the parse file
                var imageFile = new Parse.File('mypic.jpg', {
                    base64: _params.photo
                });

                // save the parse file
                imageFile
                    .save()
                    .then(function () {

                        _params.photo = null;

                        // create object to hold caption and file reference
                        var imageObject = new ImageObject();

                        // set object properties
                        imageObject.set('title', _params.title);
                        imageObject.set('user', Parse.User.current());
                        imageObject.set('img', imageFile);

                        if (_params.location !== undefined) {
                            imageObject.set('location', new Parse.GeoPoint(_params.location.latitude, _params.location.longitude));
                        }

                        // save object to parse backend
                        imageObject
                            .save()
                            .then(function (resp) {
                                console.log('Posted Photo', resp);
                                // Add User QtdPhoto
                                defer.resolve(resp);
                            });

                    }, function (error) {
                        console.log('Error', error);
                        defer.reject(error);
                    });

            } else {
                // create object to hold caption and file reference
                var imageObject = new ImageObject();

                // set object properties
                imageObject.set('caption', _params.caption);

                // save object to parse backend
                return imageObject.save();

            }


            return defer.promise;
        }

        function allComment(galleryId) {
            var defer = $q.defer();

            var gallery = new Parse
                .Query('Gallery')
                .get(galleryId, function (resp) {
                    console.log(resp);
                    return resp;
                });

            new Parse
                .Query('GalleryComment')
                .equalTo('galery', gallery)
                //.include ('commentBy')
                .descending('createdAt')
                .find()
                .then(function (resp) {
                    var objs = [];
                    angular.forEach(resp, function (item) {
                        var obj  = item.attributes;
                        obj.id   = item.id;
                        obj.user = item.attributes.commentBy;
                        objs.push(obj);
                    });
                    Loading.end();
                    defer.resolve(objs);
                });
            return defer.promise;
        }

        function getComments(obj) {
            var defer = $q.defer();

            new Parse
                .Query('Gallery')
                .get(obj)
                .then(function (gallery) {
                    new Parse
                        .Query('GalleryComment')
                        .equalTo('gallery', gallery)
                        .include('commentBy')
                        .ascending('createdAt')
                        .find()
                        .then(function (resp) {
                            var comments = [];
                            resp.map(function (item) {
                                console.warn(item);
                                var obj        = {
                                    id: item.id,
                                    text: item.attributes.text,
                                    created: item.createdAt,
                                    user: item.attributes.commentBy
                                };
                                obj.userAvatar = User.avatar(obj.user.attributes)
                                comments.push(obj);
                            });
                            defer.resolve(comments);
                        });
                });

            return defer.promise;
        }

        function updateComment(obj) {
            var defer = $q.defer();
            console.log('updateComment', obj);
            new Parse
                .Query('GalleryComment')
                .get(obj.id, function (comment) {
                    console.log('updateComment comment', comment);
                    comment.set('text', obj.text);
                    comment.save();
                    defer.resolve();
                });
            return defer.promise;
        }

        function deleteComment(item) {
            var defer = $q.defer();
            new Parse
                .Query('GalleryComment')
                .get(item.id, deleteItem);

            function deleteItem(comment) {
                comment.destroy(function () {
                    defer.resolve();
                });
            }

            return defer.promise;
        }

        function getFollow(userId) {
            var defer = $q.defer();

            User
                .find(userId)
                .then(function (user) {

                    new Parse
                        .Query('UserFollow')
                        .equalTo('user', user)
                        .include('follow')
                        .find()
                        .then(function (resp) {
                            var data = [];
                            angular.forEach(resp, function (item) {
                                console.warn(item);
                                var obj        = {
                                    id: item.id,
                                    text: item.attributes.text,
                                    user: item.attributes.follow.attributes,
                                    created: item.createdAt
                                };
                                obj.userAvatar = User.avatar(obj.user);

                                data.push(obj.user);
                            });
                            defer.resolve(data);
                        });
                });

            return defer.promise;
        }

        function getLikes(obj) {
            var defer = $q.defer();

            new Parse
                .Query('Gallery')
                .get(obj)
                .then(function (gallery) {
                    if (gallery.length) {
                        new Parse
                            .Query('GalleryLike')
                            .equalTo('gallery', gallery)
                            .include('user')
                            .ascending('createdAt')
                            .find()
                            .then(function (resp) {
                                var objs = [];
                                angular.forEach(resp, function (item) {
                                    console.warn(item);
                                    var obj        = {
                                        id: item.id,
                                        text: item.attributes.text,
                                        user: item.attributes.user.attributes,
                                        created: item.createdAt
                                    };
                                    obj.userAvatar = User.avatar(obj.user);
                                    objs.push(obj);
                                });
                                console.log(objs);
                                defer.resolve(objs);
                            });
                    } else {
                        defer.reject(true);
                    }
                });

            return defer.promise;
        }


        function nearby(position) {
            var defer = $q.defer();
            var data  = [];

            var point       = new Parse.GeoPoint(position);
            var maxDistance = 10;

            new Parse
                .Query('Gallery')
                .near('location', point)
                .withinRadians('location', point, maxDistance)
                .include('user')
                // .limit(10)
                .find()
                .then(function (resp) {
                    if (resp.length) {
                        resp.map(function (value) {
                            var size     = 100;
                            var obj      = angular.copy(value.attributes);
                            obj.id       = value.id;
                            obj.img      = User.avatar(value.attributes);
                            obj.created  = value.createdAt;
                            obj.icon     = {
                                size: {
                                    width: 100,
                                    height: 100
                                },

                                scaledSize: {
                                    width: size / 2,
                                    height: size / 2
                                },
                                url: 'img/icon.png'
                            };
                            obj.icon.url = obj.img;
                            obj.coords   = {
                                latitude: obj.location._latitude,
                                longitude: obj.location._longitude
                            };
                            data.push(obj);
                        });


                        defer.resolve(data);
                    } else {
                        defer.reject(true);
                    }
                });

            return defer.promise;
        }

        function search(string, page) {
            var defer = $q.defer();
            var data  = [];
            var limit = 15;

            new Parse
                .Query('Gallery')
                .limit(limit)
                .skip(page * limit)
                .matches('title', '* ' + string + '.*')
                .include('user')
                .find()
                .then(function (resp) {
                    resp.map(function (value) {
                        console.log('gallery search item', value);
                        var obj = {
                            id: value.id,
                            item: value.attributes,
                            src: value.attributes.img.url(),
                            created: value.createdAt,
                            user: value.attributes.user.id
                        };
                        data.push(obj);
                    });
                    defer.resolve(data);
                });

            return defer.promise;
        }

        function feed(page, user) {
            var defer   = $q.defer();
            var _limit  = 15;
            var _result = {
                total: 0,
                galleries: []
            };

            function _query() {
                if (user) {
                    return new Parse
                        .Query('Gallery')
                        .descending('createdAt')
                        .equalTo('user', user);
                } else {
                    return new Parse
                        .Query('Gallery')
                        .descending('createdAt');
                    //.notEqualTo('user', user)
                    //.containedIn('ref', following)
                    //.containsAll('ref', following)
                }
            };

            _query()
                .count()
                .then(function (totalGallery) {
                    console.log('results', totalGallery);
                    _result.total = totalGallery;
                    _query()
                        .include('user')
                        .limit(_limit)
                        .skip(page * _limit)
                        .find()
                        .then(function (resp) {

                            // console.log('home', resp);
                            var qtd = resp.length;

                            if (!qtd) {
                                defer.reject(true);
                            }

                            var cb = _.after(resp.length, function () {
                                defer.resolve(_result);
                            });

                            _.each(resp, function (item) {
                                //grab relations

                                var _likes    = item.relation('likes');
                                var _comments = item.relation('comments');

                                _likes
                                    .query()
                                    .equalTo('gallery', item)
                                    .equalTo('user', Parse.User.current())
                                    .count()
                                    .then(function (liked) {

                                        _comments
                                            .query()
                                            .include('commentBy')
                                            .ascending('createdAt')
                                            .limit(limitComment)
                                            .find()
                                            .then(function (comments) {

                                                var commentsData = [];
                                                comments.map(function (item) {
                                                    var user = item.attributes.commentBy;

                                                    var comment        = {
                                                        id: item.id,
                                                        text: item.attributes.text,
                                                        user: user,
                                                        created: item.attributes.createdAt
                                                    };
                                                    comment.userAvatar = User.avatar(comment.user.attributes);
                                                    commentsData.push(comment);
                                                });

                                                var obj        = {
                                                    id: item.id,
                                                    item: angular.copy(item.attributes),
                                                    created: item.createdAt,
                                                    likes: item.attributes.qtdLike || 0,
                                                    liked: liked,
                                                    src: item.attributes.img.url(),
                                                    comments: commentsData,
                                                    user: item.attributes.user
                                                };
                                                obj.userAvatar = User.avatar(obj.user.attributes);
                                                console.table(obj);
                                                _result.galleries.push(obj);
                                                cb();
                                            });
                                    });

                            });
                        });
                });
            return defer.promise;
        }

        function feedGrid(page, user, options) {
            var defer   = $q.defer();
            var _limit  = 30;
            var _result = {
                total: 0,
                galleries: []
            };

            function _query() {
                if (user) {
                    return new Parse
                        .Query('Gallery')
                        .descending('createdAt')
                        .equalTo('user', user);
                } else {
                    return new Parse
                        .Query('Gallery')
                        .descending('createdAt');
                }
            };

            _query()
                .count()
                .then(function (totalGallery) {
                    console.log('results', totalGallery);
                    _result.total = totalGallery;
                    _query()
                        .include('user')
                        .limit(_limit)
                        .skip(page * _limit)
                        .find()
                        .then(function (resp) {

                            var qtd = resp.length;

                            if (!qtd) {
                                defer.reject(true);
                            }

                            var cb = _.after(resp.length, function () {
                                defer.resolve(_result);
                            });

                            _.each(resp, function (item) {
                                var obj        = {
                                    id: item.id,
                                    item: angular.copy(item.attributes),
                                    created: item.createdAt,
                                    likes: item.attributes.qtdLike || 0,
                                    src: item.attributes.img.url(),
                                    user: item.attributes.user
                                };
                                obj.userAvatar = User.avatar(obj.user.attributes);
                                _result.galleries.push(obj);
                                cb();
                            });
                        });
                });
            return defer.promise;
        }


        function get(item) {
            var defer = $q.defer();

            console.log(item);
            Loading.start();

            find(item)
                .then(function (resp) {
                    console.log(resp);

                    var likes    = resp.relation('likes');
                    var comments = resp.relation('comments');

                    likes
                        .query()
                        .equalTo('gallery', item)
                        .equalTo('user', Parse.User.current())
                        .count()
                        .then(function (liked) {

                            likes
                                .query()
                                .count()
                                .then(function (likes) {

                                    comments
                                        .query()
                                        .include('commentBy')
                                        .descending('createdAt')
                                        .limit(limitComment)
                                        .find()
                                        .then(function (comments) {
                                            console.log(comments);

                                            var commentsData = [];

                                            angular.forEach(comments, function (item) {
                                                var comment        = {
                                                    id: item.id,
                                                    text: item.attributes.text,
                                                    user: item.attributes.commentBy.attributes
                                                };
                                                comment.userAvatar = User.avatar(comment.user);
                                                commentsData.push(comment);
                                            });

                                            var obj        = {
                                                id: item.id,
                                                item: item.attributes,
                                                created: item.createdAt,
                                                likes: likes,
                                                liked: liked,
                                                user: item.attributes.user.attributes,
                                                comments: commentsData
                                            };
                                            obj.userAvatar = User.avatar(obj.user);

                                            defer.resolve(obj);
                                            Loading.end();
                                        });
                                });
                        });

                });

            return defer.promise;
        }


        function find(id) {
            var defer = $q.defer();
            new Parse
                .Query('Gallery')
                .include('user')
                .get(id)
                .then(function (resp) {
                    defer.resolve(resp);
                });
            return defer.promise;
        }


        function addComment(form) {
            var defer = $q.defer();
            console.log('addComent', form);

            find(form.galleryId)
                .then(function (gallery) {
                    var Object = Parse.Object.extend('GalleryComment');
                    var item   = new Object({});

                    angular.forEach(form, function (value, key) {
                        item.set(key, value);
                    });
                    item.set('commentBy', Parse.User.current());
                    item.set('gallery', gallery);

                    item.save(null)
                        .then(function (resp) {
                            console.log(resp);

                            addActivity({
                                galleryId: gallery.id,
                                action: 'add comment'
                            });

                            gallery
                                .relation('comments')
                                .add(resp);

                            gallery
                                .save()
                                .then(function (resp) {
                                    console.log(resp);
                                    defer.resolve(resp);
                                });
                        });
                });


            return defer.promise;
        }

        function isLiked(galleryId) {
            var defer = $q.defer();

            find(galleryId)
                .then(function (gallery) {
                    new Parse
                        .Query('GalleryLike')
                        .equalTo('gallery', gallery)
                        .equalTo('user', Parse.User.current())
                        .first()
                        .then(function (resp) {
                            console.warn(resp);
                            if (resp === undefined) {
                                defer.reject(resp);
                            } else {
                                defer.resolve(resp);
                            }
                        });
                });

            return defer.promise;
        }

        function addLike(galleryId) {
            var defer = $q.defer();

            find(galleryId)
                .then(function (gallery) {
                    var Object = new Parse.Object.extend('GalleryLike');
                    var item   = new Object({});

                    item.set('user', Parse.User.current());
                    item.set('gallery', gallery);

                    console.log(gallery);

                    item.save(null)
                        .then(function (resp) {
                            console.log(resp);

                            // Gallery Increment Like
                            var likes = parseInt(gallery.attributes.qtdLike) ? parseInt(gallery.attributes.qtdLike + 1) : 1;
                            console.log('Qtd Like', likes);

                            // Increment Like
                            gallery.set('qtdLike', likes);

                            // Add Relation
                            gallery.relation('likes').add(resp);

                            console.log('Save Gallery', gallery);

                            // Save Gallery
                            gallery
                                .save()
                                .then(function (newGallery) {
                                    console.log(newGallery);
                                    defer.resolve({
                                        liked: true,
                                        likes: likes
                                    });
                                }, function (err) {
                                    console.error(err);
                                    defer.reject(err);
                                });
                        });
                });
            return defer.promise;
        }

        function removeLike(galleryId) {

            var defer = $q.defer();
            find(galleryId)
                .then(function (gallery) {

                    new Parse
                        .Query('GalleryLike')
                        .equalTo('gallery', gallery)
                        .equalTo('user', Parse.User.current())
                        .first()
                        .then(function (like) {

                            var likes = parseInt(gallery.attributes.qtdLike - 1);
                            if (likes < 0) {
                                likes = 0;
                            }

                            console.log('Remove like', likes, gallery);


                            // Gallery Decrement Like
                            gallery.set('qtdLike', likes);

                            // Remove Relation
                            gallery.relation('likes').remove(like);

                            like
                                .destroy(function (resp) {
                                    if (resp) {
                                        console.log('Remove like');
                                        // Save Gallery
                                        gallery
                                            .save()
                                            .then(function (newGallery) {
                                                console.log('New Gallery', newGallery);

                                                defer.resolve({
                                                    liked: false,
                                                    likes: newGallery.attributes.qtdLike
                                                });

                                            }, function (err) {
                                                console.error(err);
                                                defer.reject(err);
                                            });
                                    }
                                });


                        });

                });
            return defer.promise;
        }

        function likeGallery(gallery) {
            var defer = $q.defer();

            isLiked(gallery)
                .then(function (resp) {
                    console.warn(resp);
                    var promise = '';

                    if (resp) {
                        console.log('Remove Like');
                        promise = removeLike(gallery);
                        addActivity({
                            galleryId: gallery,
                            action: 'unlike like'
                        });

                    } else {
                        console.log('Add like');
                        promise = addLike(gallery);
                        addActivity({
                            galleryId: gallery,
                            action: 'add like'
                        });
                    }

                    promise
                        .then(function (resp) {
                            console.log(resp);
                            defer.resolve(resp);
                        });

                })
                .catch(function (err) {
                    console.log('Add like', err);

                    addActivity({
                        galleryId: gallery,
                        action: 'add like'
                    });

                    addLike(gallery)
                        .then(function (resp) {
                            console.log(resp);
                            defer.resolve(resp);
                        });
                });
            return defer.promise;
        }

        function getUserGalleryQtd(userId) {
            var defer = $q.defer();
            if (userId === undefined) {
                userId = Parse.User.current().id;
            }

            User
                .find(userId)
                .then(function (user) {
                    new Parse
                        .Query('Gallery')
                        .equalTo('user', user)
                        .count()
                        .then(function (qtdGalleries) {
                            defer.resolve(qtdGalleries);
                        });
                });

            return defer.promise;
        }

        function getUserGallery(userId, page) {
            var defer = $q.defer();
            var data  = [];
            var limit = 9;

            if (userId === undefined) {
                userId = Parse.User.current().id;
            }

            User
                .find(userId)
                .then(function (user) {

                    new Parse
                        .Query('Gallery')
                        .equalTo('user', user)
                        .descending('createdAt')
                        //.containedIn('ref', following)
                        //.containsAll('ref', following)
                        .include('user')
                        .limit(limit)
                        .skip(page * limit)
                        .find()
                        .then(function (resp) {

                            if (resp.length) {
                                var cb = _.after(resp.length, function () {
                                    defer.resolve(data);
                                });

                                _.each(resp, function (item) {
                                    //grab relations

                                    var likes    = item.relation('likes');
                                    var comments = item.relation('comments');

                                    likes
                                        .query()
                                        .equalTo('gallery', item)
                                        .equalTo('user', Parse.User.current())
                                        .count()
                                        .then(function (liked) {

                                            likes
                                                .query()
                                                .count()
                                                .then(function (likes) {

                                                    comments
                                                        .query()
                                                        .include('commentBy')
                                                        .descending('createdAt')
                                                        .limit(limitComment)
                                                        .find()
                                                        .then(function (comments) {
                                                            // console.log(comments);
                                                            var commentsData = [];

                                                            angular.forEach(comments, function (item) {
                                                                var comment        = {
                                                                    id: item.id,
                                                                    text: item.attributes.text,
                                                                    user: item.attributes.commentBy.attributes
                                                                };
                                                                comment.userAvatar = User.avatar(comment.user);
                                                                commentsData.push(comment);
                                                            });

                                                            var obj        = {
                                                                id: item.id,
                                                                item: item.attributes,
                                                                src: item.attributes.img.url(),
                                                                created: item.createdAt,
                                                                likes: likes,
                                                                liked: liked,
                                                                comments: commentsData,
                                                                user: item.attributes.user.attributes
                                                            };
                                                            // obj.user.id = item.attributes.user.id;
                                                            obj.userAvatar = User.avatar(obj.user);

                                                            data.push(obj);
                                                            cb();
                                                        });
                                                });
                                        });

                                });
                            } else {
                                defer.reject(true);
                            }
                        }, function () {
                            defer.reject(true);
                        });
                });

            return defer.promise;
        }

        function listActivity(page) {
            var defer = $q.defer();
            var limit = 20;

            console.info(page, limit);


            new Parse
                .Query('GalleryActivity')
                .include('user')
                .include('gallery')
                .descending('createdAt')
                .limit(limit)
                .skip(page * limit)
                .find()
                .then(function (resp) {
                    if (resp.length) {
                        var data = [];
                        resp.map(function (item) {
                            var obj        = {
                                id: item.id,
                                user: item.attributes.user ? item.attributes.user.attributes : {
                                    name: 'Nulled',
                                    img: {
                                        _url: 'img/user.png'
                                    }
                                },
                                img: item.attributes.gallery ? item.attributes.gallery.attributes.img : null,
                                action: item.attributes.action,
                                created: item.attributes.createdAt
                            };
                            obj.userAvatar = User.avatar(obj.user)
                            data.push(obj);
                        });
                        defer.resolve(data);
                    } else {
                        defer.reject(true);
                    }
                });

            return defer.promise;
        }

        function addActivity(data) {
            /*
             * ACTIONS
             * add photo
             * add comment
             * like photo
             * unlike photo
             * register
             * */

            console.info(data);

            if (data.galleryId) {
                find(data.galleryId)
                    .then(function (gallery) {
                        var Object = Parse.Object.extend('GalleryActivity');
                        var item   = new Object({});

                        item.set('user', Parse.User.current());
                        item.set('gallery', gallery);
                        item.set('action', data.action);

                        item.save()
                            .then(function (resp) {
                                console.warn(resp);
                            });
                    });
            } else {
                var Object = Parse.Object.extend('GalleryActivity');
                var item   = new Object({});

                item.set('user', Parse.User.current());
                item.set('action', data.action);

                item.save()
                    .then(function (resp) {
                        console.warn(resp);
                    });
            }
        }


    }


})();