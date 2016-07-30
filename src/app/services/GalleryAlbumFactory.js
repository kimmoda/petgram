(function () {
    'use strict';
    angular.module('starter').factory('GalleryAlbum', GalleryFactory);

    function GalleryFactory($q, ParseCloud, moment) {

        var ParseObject = Parse.Object.extend('GalleryAlbum', {
                getStatus: function () {
                    if (this.isApproved) {
                        return 'Approved';
                    } else if (this.isApproved === false) {
                        return 'Rejected';
                    } else {
                        return 'Pending';
                    }
                }
            },
            {
                create : function (item) {
                    var defer       = $q.defer();
                    var parseObject = new ParseObject();
                    parseObject.save(item, {
                        success: defer.resolve,
                        error  : defer.reject
                    });
                    return defer.promise;
                },
                update : function (item) {
                    var defer = $q.defer();
                    item.save(null, {
                        success: defer.resolve,
                        error  : defer.reject
                    });
                    return defer.promise;
                },
                destroy: function (item) {
                    var defer = $q.defer();
                    item.destroy({
                        success: defer.resolve,
                        error  : defer.reject
                    });
                    return defer.promise;
                },
                photos : function (params) {
                    return ParseCloud.run('photoAlbum', params);
                },
                list   : function (params) {
                    return ParseCloud.run('listAlbum', params);
                },
                get    : function (objectId) {
                    var defer = $q.defer();
                    new Parse.Query(this)
                        .get(objectId, {
                            success: defer.resolve,
                            error  : defer.reject
                        });

                    return defer.promise;
                },
            });

        Object.defineProperty(ParseObject.prototype, 'title', {
            get: function () {
                return this.get('title');
            },
            set: function (value) {
                this.set('title', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'qtyPhotos', {
            get: function () {
                return this.get('qtyPhotos');
            },
            set: function (value) {
                this.set('qtyPhotos', value);
            }
        });


        Object.defineProperty(ParseObject.prototype, 'image', {
            get: function () {
                return this.get('image');
            },
            set: function (value) {
                this.set('image', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'imageThumb', {
            get: function () {
                return this.get('imageThumb');
            },
            set: function (value) {
                this.set('imageThumb', value);
            }
        });


        Object.defineProperty(ParseObject.prototype, 'isApproved', {
            get: function () {
                return this.get('isApproved');
            },
            set: function (value) {
                this.set('isApproved', value);
            }
        });

        Object.defineProperty(ParseObject.prototype, 'expiresAt', {
            get: function () {
                return this.get('expiresAt');
            },
            set: function (value) {
                this.set('expiresAt', value);
            }
        });

        return ParseObject;

    }

})();
