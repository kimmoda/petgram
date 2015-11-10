var gulp  = require('gulp');
var clean = require('gulp-clean');
var paths = gulp.paths;

gulp.task('clean', function () {
    return gulp.src(paths.dist, {read: false})
        .pipe(clean());
});
