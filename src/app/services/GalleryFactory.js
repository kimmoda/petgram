(function () {
    'use strict';
    var _ParseClass = 'Gallery';
    angular.module('starter').factory(_ParseClass, function ($q, Parse, $translate) {

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

            var ParseObject = Parse.Object.extend(_ParseClass, {},
                {
                    create     : put,
                    update     : put,
                    destroy    : destroy,
                    comments   : comments,
                    getAlbum   : getAlbum,
                    feed       : feed,
                    search     : search,
                    follow     : follow,
                    likeGallery: likeGallery,
                    get        : get,
                });


            function get(galleryId) {
                return new Parse.Query(this).include('profile').get(galleryId);

            }

            function likeGallery(params) {
                return Parse.Cloud.run('likeGallery', {galleryId: params.galleryId});
            }

            function follow(params) {
                return Parse.Cloud.run('followUser', params);
            }

            function search(params) {
                return Parse.Cloud.run('searchGallery', params);
            }

            function feed(params) {
                return Parse.Cloud.run('feedGallery', params);
            }

            function comments(params) {
                return Parse.Cloud.run('commentGallery', params);
            }

            function getAlbum(params) {
                return Parse.Cloud.run('getAlbum', params);
            }

            function put(item) {

                if (item.address && item.address.geo) {
                    item.location = new Parse.GeoPoint(item.address.geo);
                }

                item.lang = $translate.use();

                if (!item.id) {
                    var objPlace = new ParseObject();
                    return objPlace.save(item);
                } else {
                    return item.save();
                }

            }

            function destroy(item) {
                return item.destroy();
            }


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
    );


})();
