var gulp       = require ('gulp'),
    plugins    = require ('gulp-load-plugins'),
    bowerFiles = require ('main-bower-files'),
    paths      = require ('../../config');

gulp.task ('inject', function () {
    return gulp.src (paths.src.index)
        .pipe (plugins.inject (gulp.src (bowerFiles (), {read: false}), {name: 'bower', relative: true}))
        .pipe (plugins.inject (gulp.src (paths.src.js, {read: false}), {relative: true}))
        .pipe (plugins.inject (gulp.src (paths.src.css, {read: false}), {relative: true}))
        .pipe (gulp.dest (paths.source));
});