var gulp   = require ('gulp'),
    sass   = require ('gulp-sass'),
    paths  = require ('../../config');

gulp.task ('sass', function (done) {
    gulp.src (paths.sass)
        .pipe (sass ())
        //.pipe (gulp.dest (paths().source + '/css/'))
        //    .pipe (minifycss ({
        //    keepSpecialComments: 0
        //}))
        //.pipe (rename ({extname: '.min.css'}))
        .pipe (gulp.dest ('./www/css/'))
        .on ('end', done);
});
