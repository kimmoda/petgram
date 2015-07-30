var gulp    = require ('gulp'),
    plugins = require ('gulp-load-plugins'),
    paths   = require ('../../config.js');

gulp.task ('rename:prod', plugins ().shell.task ([
        'mv www dev && mv beta www'
    ], {
        ignoreErrors: true
    }
));

gulp.task('rename:dev', plugins().shell.task([
        'mv www beta && mv dev www'
    ], {
        ignoreErrors: true
    }
));