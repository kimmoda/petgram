'use strict';
var path     = require('path');
var gulp     = require('gulp');
var prettify = require('gulp-jsbeautifier');
var paths    = require('./config').paths;

// Prettify Code
gulp.task('prettify', [
    'prettify:js:app',
    'prettify:html:app'
]);

gulp.task('prettify:js:app', function () {
    gulp.src(paths.src +'/js/**/*.js')
        .pipe(prettify({config: ".jsbeautifyrc"}))
        .pipe(gulp.dest(paths.src + '/js'));
});


// HTML
gulp.task('prettify:html:app', function () {
    gulp.src(paths.src + '/js/**/*.html')
        .pipe(prettify({
            braceStyle         : "collapse",
            indentChar: " ",
            indentScripts: "keep",
            indentSize   : 4,
            maxPreserveNewlines: 10,
            preserveNewlines   : true,
            wrapLineLength     : 0
        }))
        .pipe(gulp.dest(paths.src + '/js'));
});
