'use strict';
var gulp        = require ('gulp');
var runSequence = require ('run-sequence');
var conf        = require ('./gulp/config');
gulp.paths      = conf.paths;

require ('require-dir') ('./gulp');


// Master Tasks
gulp.task('default', function (done) {
    return runSequence (
        'install',
        'sass',
        'translate',
        'inject',
        'prettify',
        done);
});

gulp.task('dev', function (done) {
    return runSequence (
        'install',
        'sass',
        'translate',
        'copy:font',
        'inject',
        //'prettify',
        done);
});

gulp.task('prod', function (done) {
    return runSequence (
        'clean',
        'templates',
        'dev',
        'img',
        'copy',
        'cacheapp:add',
        'cachemodule:add',
        'usemin',
        'cacheapp:remove',
        'cachemodule:remove',
        done);
});
