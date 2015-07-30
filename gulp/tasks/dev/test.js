var gulp   = require ('gulp');
var karma  = require ('gulp-karma');
var config = require ('../../config');

gulp.task ('test', function () {
    return
    gulp.src (config.src.js)
        .pipe (karma ({
        configFile: './karma.conf.js',
        action    : run
    }))
        .on ('error', function (err) {
        throw err;
    });
});