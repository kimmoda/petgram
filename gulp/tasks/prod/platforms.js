var gulp        = require ('gulp'),
    fs          = require ('fs'),
    clean       = require ('gulp-clean'),
    paths       = require ('../../config'),
    runSequence = require ('run-sequence');

var distDir             = 'dist';
var iosPlatformsDir     = 'platforms/ios/www';
var androidPlatformsDir = './platforms/android/assets/www';
var fileCordova         = '/cordova.js';
var fileCordovaPlugins  = '/cordova_plugins.js';


// Android
gulp.task ('android:clean', function () {
    return gulp.src (androidPlatformsDir, {read: false})
        .pipe (clean ());
});

// Android
gulp.task ('android:cordova', function () {

    return gulp.src (androidPlatformsDir + '/*.js')
        .pipe (gulp.dest (paths.dist));
});

gulp.task ('android:assets', function () {
    return gulp.src (paths.dist + '/**')
        .pipe (gulp.dest (androidPlatformsDir));
});

gulp.task ('android', function (cb) {
    return runSequence (
        'android:cordova',
        'android:clean',
        'android:assets',
        cb
    );
});

// IOS
gulp.task ('ios:clean', function () {
    return gulp.src (iosPlatformsDir, {read: false})
        .pipe (clean ());
});

// Android
gulp.task ('ios:cordova', function () {

    return gulp.src (iosPlatformsDir + '/*.js')
        .pipe (gulp.dest (paths.dist));
});

gulp.task ('ios:assets', function () {
    return gulp.src (paths.dist + '/**')
        .pipe (gulp.dest (iosPlatformsDir));
});

gulp.task ('ios', function (cb) {
    return runSequence (
        'ios:cordova',
        'ios:clean',
        'ios:assets',
        cb
    );
});