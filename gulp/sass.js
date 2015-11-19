'use strict';
var gulp        = require ('gulp');
var path        = require ('path');
var gutil       = require ('gulp-util');
var $           = require ('gulp-load-plugins') ();
var _           = require ('lodash');
var sass        = require ('gulp-sass');
var paths       = gulp.paths;
var sassOptions = {style: 'expanded'};

var injectFiles = gulp.src([paths.src + '/js/**/*.scss'], {read: false});

var injectOptions = {
    transform: function (filePath) {
        return '@import "' + filePath + '";';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
};

gulp.task('sass:inject', function () {
    gulp
        .src(paths.scss + '/ionic.app.scss')
        .pipe($.inject(injectFiles, injectOptions))
        .pipe(gulp.dest(paths.scss));
});

gulp.task('sass', function () {

    gulp
        .src(paths.scss + '/ionic.app.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass(sassOptions).on('error', $.sass.logError))
        .pipe($.autoprefixer())
        .pipe($.sourcemaps.write('./map'))
        .pipe(gulp.dest(paths.src + '/css'));
});
