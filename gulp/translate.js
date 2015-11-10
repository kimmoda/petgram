var gulp    = require('gulp');
var rename  = require('gulp-rename');
var extend  = require('gulp-extend');
var wrap    = require('gulp-wrap');
var gettext = require('gulp-angular-gettext');
var replace = require('gulp-replace');
var iife    = require("gulp-iife");
var paths = gulp.paths;

// Translate
gulp.task('gettext:po', function () {
    return gulp.src([
            paths.src + '/js/**/*.js',
            '!' + paths.src + '/js/**/*.spec.js',
            paths.src + '/js/**/*.html'
        ])
        .pipe(gettext.extract('template.pot', {
            // options to pass to angular-gettext-tools...
        }))
        .pipe(gulp.dest('./translate/'));
})
;

gulp.task('gettext:compile', function () {
    return gulp.src('translate/**/*.po') // Stream PO translation files.
        .pipe(gettext.compile({format: 'json'})) // Compile to json
        .pipe(extend('.tmp.json')) // use .json extension for gulp-wrap to load json content
        .pipe(wrap( // Build the translation module using gulp-wrap and lodash.template
            //'\'use strict\';\n' +
            'angular.module(\'app.translate\',[\'ionic\'])\n' +
            '.run(function (gettextCatalog) {\n' +
            '<% var langs = Object.keys(contents); var i = langs.length; while (i--) {' +
            'var lang = langs[i]; var translations = contents[lang]; %>' +
            '  gettextCatalog.setStrings(\'<%= lang %>\', <%= JSON.stringify(translations, undefined, 2) %>);\n' +
            '<% }; %>' +
            '});'))
        //.pipe (ngAnnotate ())
        //.pipe (uglify ())
        .pipe(rename('app.translate.module.js')) // Rename to final javascript filename
        .pipe(iife())
        .pipe(gulp.dest(paths.src + '/js/'));
});

gulp.task('translations', function () {
    return gulp.src('translate/**/*.po')
        .pipe(gettext.compile({
            // options to pass to angular-gettext-tools...
            format: 'json'
        }))
        .pipe(gulp.dest(paths.src + '/js/il8n'));
});

gulp.task('translate', [
    'gettext:po',
    'gettext:compile'
]);
