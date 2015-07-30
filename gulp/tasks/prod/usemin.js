var gulp = require('gulp'),
    fs = require('fs'),
    plugins = require('gulp-load-plugins')(),
    paths = require('../../config');

 
// Get copyright using NodeJs file system
var getCopyright = function () {
    return fs.readFileSync('./LICENSE');
};
 

gulp.task('usemin', function () {
    return gulp.src(paths.source + '/index.html')
        .pipe(plugins.usemin({
            css: [
                plugins.minifyCss()
            ],
            cssvendor: [
                plugins.minifyCss()
            ],
            html: [plugins.minifyHtml({
                empty: true
            })],
            jsvendor: [
                // jshint.reporter ('default'),
                plugins.uglify(),
                plugins.rev()
            ],
            js: [
                plugins.stripDebug(),
                plugins.jshint.reporter('default'),
                plugins.ngAnnotate({
                    add: true
                }),
                plugins.uglify(),
                plugins.header(getCopyright(), {
                    version: paths.version
                }),
                plugins.rev()
            ]
        }))
        .pipe(gulp.dest(paths.dist));
});