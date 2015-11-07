'use strict';
var path     = require('path');
var gulp     = require('gulp');
var imagemin = require('gulp-imagemin');
var paths    = require('./config').paths;

// Image Mim
gulp.task('img', function () {
    return gulp.src(paths.src + '/img/**/*')
        //.pipe(imageResize({width: 1080}))
        .pipe(imagemin({
            optimizationLevel: 4,
            progressive      : true,
            interlace        : true
        }))
        .pipe(gulp.dest(paths.src + '/img'));
});
