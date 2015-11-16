'use strict';
var path = require ('path');
var gulp = require ('gulp');
var bowerFiles = require ('main-bower-files');
var $ = require ('gulp-load-plugins') ();
var paths = gulp.paths;


gulp.task('inject', function (done) {

    var injectScripts = gulp.src([
        paths.src + '/js/**/*.module.js',
        paths.src + '/js/*.js',
        paths.src + '/js/**/*.js',
        paths.src + '/js/app.js',
        '!' + paths.src + '/js/**/*.spec.js',
        '!' + paths.src + '/js/**/*Spec.js',
        '!' + paths.src + '/js/**/*.mock.js'
    ])
        .pipe($.angularFilesort());

    var injectStyles = gulp.src([
        path.join(paths.src + '/css/*.css'),
    ], {read: false});

    var injectOptions = {
        ignorePath: [],
        addRootSlash: false,
        relative: true
    };


    gulp.src(paths.src + '/index.html')
        .pipe($.inject(gulp.src(bowerFiles (), {read: false}), {name: 'bower', relative: true}))
        .pipe($.inject(injectStyles, injectOptions))
        .pipe($.inject(injectScripts, injectOptions))
        .pipe(gulp.dest(paths.src))
        .on('end', done);
});
