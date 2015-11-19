'use strict';
var path          = require('path');
var gulp          = require('gulp');
var minifyHTML    = require('gulp-minify-html');
var templateCache = require('gulp-angular-templatecache');
var iife          = require("gulp-iife");
var paths = gulp.paths;

// Templates
gulp.task('template:app', function () {
    gulp.src([paths.src + '/js/**/*.html'])
        .pipe(minifyHTML({quotes: true}))
        .pipe(templateCache({
            module    : 'app.cache',
            filename: 'app.cache.module.js',
            root    : 'js',
            standalone: true
        }))
        .pipe(iife())
        .pipe(gulp.dest(paths.src + '/js/'));
});


gulp.task('templates', [
    'template:app'
]);
