var gulp  = require('gulp');
var clean = require('gulp-clean');
var paths = require('./config').paths;

gulp.task('clean', function () {
    return gulp.src(paths.dist, {read: false})
        .pipe(clean());
});