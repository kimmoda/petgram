'use strict';
var gulp = require ('gulp');
var $    = require ('gulp-load-plugins') ();

var paths = gulp.paths;
var sassOptions = {
    style: 'expanded',
    errLogToConsole: true
};

var injectFiles = gulp.src([paths.src + '/js/**/*.scss'], {read: false});

var injectOptions = {
    transform: function (filePath) {
        return '@import "' + filePath + '";';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
};

gulp.task('sass:inject', function (done) {
    gulp
        .src(paths.scss + '/ionic.app.scss')
        .pipe($.inject(injectFiles, injectOptions))
        .pipe(gulp.dest(paths.scss))
        .on('end', done);
});

gulp.task('sass', function (done) {

    gulp
        .src(paths.scss + '/ionic.app.scss')
        //.pipe($.sourcemaps.init())
        .pipe($.sass(sassOptions))
        //.pipe($.autoprefixer())
        //.pipe($.sourcemaps.write('./map'))
        .pipe(gulp.dest(paths.src + '/css'))
        .on('end', done);
});
