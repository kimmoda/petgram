'use strict';
angular
    .module ('module.gallery')
    .controller ('GalleryPhotoCtrl', function ($stateParams, Gallery) {
    var self = this;

    function init () {
        self.form = {
            galleryId: $stateParams.id,
            text     : ''
        };

        loadComments ();
    }

    self.formFields = Gallery.formComment;

    Gallery
        .get ($stateParams.id)
        .then (function (resp) {
        self.data = resp;
    });

    function loadComments () {
        Gallery
            .allComment ($stateParams.id)
            .then (function (resp) {
            console.log (resp);
            self.comments = resp;
        });
    };

    init ();

    self.submitComment = function (rForm, form) {
        if (rForm.$valid) {
            var dataForm = angular.copy (form);
            Gallery
                .addComment (dataForm)
                .then (function (resp) {
                console.log (resp);
                loadComments ();
            });
        }
    };

});