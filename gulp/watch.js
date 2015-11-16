'use strict';

var path    = require('path');
var gulp    = require('gulp');
var console = require('console');
var paths = gulp.paths;
var paths = {
  sass: ['./scss/**/*.scss', paths.src + '/js/**/*.scss']
};


// Watch
gulp.task('watch', function () {
    // Bower
    gulp.watch(paths.lib, ['inject']);
    // Sass
    gulp.watch(paths.sass, ['sass']);

    // Js and Javascript
    gulp.watch([
        paths.src + '/lib/**/*.js',
        paths.src + '/js/**/*.js',
        paths.src + '/js/**/*.html',
    ], [
        'inject'
    ]);
});
