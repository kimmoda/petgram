'use strict';
var gulp    = require('gulp');
var rename  = require('gulp-rename');
var extend  = require('gulp-extend');
var wrap    = require('gulp-wrap');
var gettext = require('gulp-angular-gettext');
var iife    = require('gulp-iife');
var conf = require('./conf');

// Translate
gulp.task('gettext:po', function () {
    return gulp.src([
            conf.paths.src + '/app/**/*.js',
            '!' + conf.paths.src + '/app/**/*Spec.js',
            '!' + conf.paths.src + '/app/**/*.spec.js',
            conf.paths.src + '/app/**/*.html'
        ])
        .pipe(gettext.extract('template.pot', {
            // options to pass to angular-gettext-tools...
        }))
        .pipe(gulp.dest('./translate/'));
});

gulp.task('gettext:compile', function () {
     gulp.src('translate/**/*.po') // Stream PO translation files.
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
        .pipe(rename('index.translate.module.js')) // Rename to final javascript filename
        .pipe(iife())
        .pipe(gulp.dest(conf.paths.src + '/app/'));
});

gulp.task('translations', function () {
     gulp.src('translate/**/*.po')
        .pipe(gettext.compile({
            // options to pass to angular-gettext-tools...
            format: 'json'
        }))
        .pipe(gulp.dest(conf.paths.src + '/app/il8n'));
});

gulp.task('translate', [
    'gettext:po',
    'gettext:compile'
]);
