'use strict';
var path  = require('path');
var gulp  = require('gulp');
var paths = require('./config').paths;

// Copy
gulp.task('copy', function () {
    // Images
    gulp
        .src(paths.src + '/img/**')
        .pipe(gulp.dest(paths.dist + '/img'));

    // Deploy
    gulp
        .src(paths.src + '/fonts/**')
        .pipe(gulp.dest(paths.dist + '/fonts'));

    // Ionic
    gulp
        .src(paths.src + '/lib/ionic/fonts/**')
        .pipe(gulp.dest(paths.dist + '/fonts'));

    gulp
        .src(paths.src + '/lib/ionic/fonts/**')
        .pipe(gulp.dest(paths.dist + '/lib/ionic/fonts'));

});

// Copy Fonts
gulp.task('copy:font', function () {

    // Ionic
    gulp
        .src(paths.src + '/lib/ionic/fonts/**')
        .pipe(gulp.dest(paths.dist + '/fonts'));

    // Ionic Icons
    gulp
        .src(paths.src + '/lib/simple-line-icons/fonts/**')
        .pipe(gulp.dest(paths.dist + '/fonts'));


});
