'use strict';

var path  = require('path');
var gulp  = require('gulp');
var bowerFiles = require('main-bower-files');
var paths = require('./config').paths;

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _       = require('lodash');

gulp.task('inject', function () {
    var injectStyles = gulp.src([
        path.join(paths.src, '/css/*.css'),
    ], {read: false});

    var injectScripts = gulp.src([
            path.join(paths.src, '/js/**/*.module.js'),
            path.join(paths.src, '/js/*.js'),
            path.join(paths.src, '/js/**/*.js'),
            path.join(paths.src, '/js/app.js'),
            path.join('!' + paths.src, '/js/**/*.spec.js'),
            path.join('!' + paths.src, '/js/**/*Spec.js'),
            path.join('!' + paths.src, '/js/**/*.mock.js')
        ])
        .pipe($.angularFilesort());

    var injectOptions = {
        ignorePath  : [
            paths.src
        ],
        addRootSlash: false
    };

    var wiredepOptions = {
        directory: paths.lib,
        exclude  : [
            /bootstrap\.css/,
            /foundation\.css/,
            /material-design-iconic-font\.css/,
            /default\.css/
        ]
    };

    return gulp.src(path.join(paths.src, '/index.html'))
        .pipe($.inject(gulp.src(bowerFiles(), {read: false}), {
            name: 'bower',
            relative: true
        }))
        .pipe($.inject(injectStyles, injectOptions))
        .pipe($.inject(injectScripts, injectOptions))
        .pipe(gulp.dest(path.join(paths.src)));
});
