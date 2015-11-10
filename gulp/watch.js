'use strict';

var path    = require('path');
var gulp    = require('gulp');
var console = require('console');
var paths = gulp.paths;

// Watch
gulp.task('watch', function () {
    // Bower
    gulp.watch(paths.lib, ['inject']);
    // Sass
    gulp.watch([
        paths.src + '/js/**/*.scss',
    ], ['sass']);

    // Js and Javascript
    gulp.watch([
        paths.src + '/js/**/*.js',
        paths.src + '/**/*.html',
        paths.src + '/index.html',
    ], [
        'inject'
    ]);
});
