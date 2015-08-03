'use strict';
angular
    .module ('module.gallery')
    .factory ('Gallery', function ($http, $q, gettextCatalog,  CacheFactory, Notify, Loading) {

    var cacheGallery;

    if (!CacheFactory.get ('Gallery')) {
        cacheGallery = CacheFactory.createCache ('Gallery', {
            //maxAge        : seconds * 1000, // Items added to this cache expire after 15 minutes.
            //deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
            storageMode: 'localStorage' // This cache will use `localStorage`.
        });
    }

    if (!CacheFactory.get ('GalleryPhoto')) {
        cacheGallery = CacheFactory.createCache ('GalleryPhoto', {
            //maxAge        : seconds * 1000, // Items added to this cache expire after 15 minutes.
            //deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
            storageMode: 'localStorage' // This cache will use `localStorage`.
        });
    }


    var galleryCache      = CacheFactory.get ('Gallery');
    var galleryPhotoCache = CacheFactory.get ('GalleryPhoto');

    var form = [
        {
            key            : 'title',
            type           : 'input',
            templateOptions: {
                type: 'text',
                placeholder    : gettextCatalog.getString ('Title'),
                icon           : 'icon-envelope',
                required       : true,
                iconPlaceholder: true
            }
        },
        {
          key: 'geo',
          type: 'toggle',
          templateOptions: {
            label: gettextCatalog.getString ('Geolocalization'),
            toggleClass: 'positive'
          }
        }
    ];

    function all () {
        var defer = $q.defer ();
        Loading.show ();

        new Parse
            .Query ('Gallery')
            .include ('user')
            .find ()
            .then (function (resp) {
            var objs = [];
            angular.forEach (resp, function (item) {
                var obj = item;
                obj.user = obj.get('user');
                console.log(obj);

                objs.push({
                  data: obj.attributes,
                  src: obj.attributes.img._url,
                  created: obj.createdAt,
                  user: obj.user.attributes
                });

            });
            Loading.hide ();
            defer.resolve (objs);
        });

        return defer.promise;
    }

    function getPhotos (item) {
        var defer = $q.defer ();

        new Parse
            .Query ('GalleryPhoto')
            .equalTo ('gallery_id', item)
            .find ()
            .then (function (resp) {
            var photos = [];
            angular.forEach (resp, function (item) {
                var photo = item.attributes;
                photo.id  = item.id;
                console.info (photo)
                galleryPhotoCache.put (item.id, photo);
                photos.push (photo);
            });
            console.info (photos);
            defer.resolve (photos);
        });

        return defer.promise;
    }

    function getPhoto (id) {
        var defer = $q.defer ();
        Loading.show ();
        Loading.hide ();
        defer.resolve (galleryPhotoCache.get (id));
        return defer.promise;
    }

    function get (galleryId) {
        var defer = $q.defer ();

        var gallery = galleryCache.get (galleryId);
        Loading.show ();
        Loading.hide ();
        defer.resolve (gallery);

        return defer.promise;
    }


    function upload (name, imageData) {
        var defer = $q.defer ();


        var parseFile = new Parse.File ('photo.jpg', {base64: imageData});

        parseFile
            .save (function () {
            console.log (parseFile);

            var gallery = new Parse.Object ('Gallery');
            gallery.set ('title', 'teste');
            gallery.set ('body', 'descricao');
            gallery.set ('img', parseFile);
            gallery.save (function (resp) {
                console.log (resp);
                defer.resolve (resp);
            });
        });


        return defer.promise;
    }

    return {
        all     : all,
        form: form,
        getPhoto: getPhoto,
        get     : get,
        upload  : upload
    };

});
