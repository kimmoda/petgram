'use strict';

var path    = require('path');
var gulp    = require('gulp');
var gutil   = require('gulp-util');
var wiredep = require('wiredep').stream;
var $       = require('gulp-load-plugins')();
var _       = require('lodash');
var paths = gulp.paths;

gulp.task('sass', function () {
    var sassOptions = {
        style: 'expanded'
    };

    var injectFiles = gulp.src([
        path.join(paths.src, '/js/**/*.scss')
    ], {read: false});

    var injectOptions = {
        transform   : function (filePath) {
            return '@import "' + filePath + '";';
        },
        starttag    : '// injector',
        endtag      : '// endinjector',
        addRootSlash: false
    };

    return gulp.src([
            path.join(paths.scss, '/ionic.app.scss')
        ])
        .pipe($.inject(injectFiles, injectOptions))
        .pipe(wiredep(_.extend({}, paths.wiredep)))
        .pipe($.sourcemaps.init())
        .pipe($.sass(sassOptions)).on('error', errorHandler('Sass'))
        .pipe($.autoprefixer()).on('error', errorHandler('Autoprefixer'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(path.join(paths.src, '/css/')));
});

function errorHandler(title) {
    'use strict';

    return function (err) {
        gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
        this.emit('end');
    };
};
