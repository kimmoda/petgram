(function () {
    'use strict';
    angular.module('starter').factory('Gallery', GalleryFactory);

    function GalleryFactory($q, Parse, $translate, moment) {

        var fields = [
            'title',
            'commentsTotal',
            'likesTotal',
            'user',
            'profile',
            'hashtags',
            'words',
            'privacity',
            'address',
            'lang',
            'image',
            'imageThumb',
            'isApproved',
            'expiresAt',
            'icon',
        ];

        var ParseObject = Parse.Object.extend('Gallery', {},
            {
                create     : function (item) {
                    var defer    = $q.defer();
                    var objPlace = new ParseObject();

                    if (item.address && item.address.geo) {
                        item.location = new Parse.GeoPoint(item.address.geo);
                    }

                    item.lang = $translate.use();

                    objPlace.save(item, {
                        success: defer.resolve,
                        error  : defer.reject
                    });

                    return defer.promise;
                },
                update     : function (item) {
                    var defer = $q.defer();
                    item.save(null, {
                        success: defer.resolve,
                        error  : defer.reject
                    });
                    return defer.promise;
                },
                destroy    : function (item) {
                    var defer = $q.defer();
                    item.destroy({
                        success: defer.resolve,
                        error  : defer.reject
                    });
                    return defer.promise;
                },
                comments   : function (params) {
                    return Parse.Cloud.run('commentGallery', params);
                },
                getAlbum   : function (params) {
                    return Parse.Cloud.run('getAlbum', params);
                },
                feed       : function (params) {
                    return Parse.Cloud.run('feedGallery', params);
                },
                search     : function (params) {
                    return Parse.Cloud.run('searchGallery', params);
                },
                follow     : function (params) {
                    return Parse.Cloud.run('followUser', params);
                },
                likeGallery: function (params) {
                    return Parse.Cloud.run('likeGallery', {galleryId: params.galleryId});
                },
                get        : function (galleryId) {
                    var defer = $q.defer();
                    new Parse.Query(this)
                        .include('profile')
                        .get(galleryId, {
                            success: defer.resolve,
                            error  : defer.reject
                        });

                    return defer.promise;
                },
                all        : function (params) {
                    var defer = $q.defer();
                    var query = new Parse.Query(this);

                    //if (params.filter != '') {
                    //    query.contains('words', params.filter);
                    //}

                    // Order Table
                    if (params.order) {
                        if (params.order.indexOf('-') < -1) {
                            query.ascending(params.order);
                        } else {
                            query.descending(params.order.replace('-'));
                        }
                    }

                    // Status
                    if (params.status && params.status !== null) {
                        if (params.status === 'pending') {
                            query.doesNotExist('isApproved');
                        } else if (params.status === 'rejected') {
                            query.equalTo('isApproved', false);
                        } else if (params.status === 'approved') {
                            query.equalTo('isApproved', true);
                        }
                    }

                    // Limit by page
                    query.limit(params.limit);

                    // Paginate
                    query.skip((params.page * params.limit) - params.limit);
                    query.find({
                        success: defer.resolve,
                        error  : defer.reject
                    });

                    return defer.promise;
                },
                count      : function (params) {
                    var defer = $q.defer();
                    var query = new Parse.Query(this);

                    if (params.filter != '') {
                        query.contains('words', params.filter);
                    }

                    if (params.date && params.date !== null) {
                        var start = moment(params.date).startOf('day');
                        var end   = moment(params.date).endOf('day');
                        query.greaterThanOrEqualTo('createdAt', start.toDate());
                        query.lessThanOrEqualTo('createdAt', end.toDate());
                    }

                    if (params.status && params.status !== null) {

                        if (params.status === 'pending') {
                            query.doesNotExist('isApproved');
                        } else if (params.status === 'rejected') {
                            query.equalTo('isApproved', false);
                        } else if (params.status === 'approved') {
                            query.equalTo('isApproved', true);
                        }
                    }

                    query.count({
                        success: function (count) {
                            defer.resolve(count);
                        },
                        error  : function (error) {
                            defer.reject(error);
                        }
                    });

                    return defer.promise;
                }
            });


        fields.map(function (field) {
            Object.defineProperty(ParseObject.prototype, field, {
                get: function () {
                    return this.get(field);
                },
                set: function (value) {
                    this.set(field, value);
                }
            });
        });

        // This is a GeoPoint Object
        Object.defineProperty(ParseObject.prototype, 'location', {
            get: function () {
                return this.get('location');
            },
            set: function (val) {
                this.set('location', new Parse.GeoPoint({
                    latitude : val.latitude,
                    longitude: val.longitude
                }));
            }
        });


        return ParseObject;

    }

})();
