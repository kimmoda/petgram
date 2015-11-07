'use strict';
var gulp        = require('gulp');
var wrench      = require('wrench');
var runSequence = require('run-sequence');
var conf        = require('./gulp/config');
gulp.paths      = conf.paths;

require('require-dir')('./gulp');


// Master Tasks
gulp.task('default', function (cb) {
    return runSequence(
        'install',
        'sass',
        'translate',
        'inject',
        'prettify',
        cb)
});

gulp.task('dev', function (cb) {
    return runSequence(
        'install',
        'sass',
        'translate',
        'copy:font',
        'inject',
        //'prettify',
        cb);
});

gulp.task('prod', function (cb) {
    return runSequence(
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
        cb
    );
});