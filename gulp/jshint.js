'use strict';
var path    = require('path');
var gulp    = require('gulp');
var jshint  = require('gulp-jshint');
var stylish = require('jshint-stylish');
var paths   = require('./config').paths;

// Lint
gulp.task('jshint', function () {
    return gulp.src(paths.src + '/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});