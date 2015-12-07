'use strict';
var gulp        = require ('gulp');
var runSequence = require ('run-sequence');
var conf        = require ('./gulp/config');
var sh          = require ('shelljs');
gulp.paths      = conf.paths;

require ('require-dir') ('./gulp');


// Master Tasks
gulp.task('default', function (done) {
    return runSequence (
        'install',
        'sass',
        // 'translate',
        'inject',
        'prettify',
        done);
});

gulp.task('dev', function (done) {
    return runSequence (
        'install',
        'sass',
        // 'translate',
        'copy:font',
        'inject',
        'prettify',
        done);
});

gulp.task('prod', function (done) {
    return runSequence (
        'clean',
        'dev',
        'templates',
        'img',
        'copy',
        'cacheapp:add',
        'usemin',
        'cacheapp:remove',
        done);
});


gulp.task('serve', function (done) {
    sh.exec('ionic serve');
    done ();
});

gulp.task('folderprod', function (done) {
    sh.exec('mv www temp && mv dist www');
    done ();
});

gulp.task('folderdev', function (done) {
    sh.exec('mv www dist && mv temp www');
    done ();
});

gulp.task('livereload android', function (done) {
    sh.exec('ionic run android -l');
    done ();
});

gulp.task('android', function (done) {
    sh.exec('ionic run android');
    done ();
});