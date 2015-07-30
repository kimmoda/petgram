var gulp        = require ('gulp'),
    runSequence = require ('run-sequence');

gulp.task ('deploy', function (cb) {
    return runSequence (
        'build',
        'ftp',
        cb
    );
});