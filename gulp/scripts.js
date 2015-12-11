'use strict';

var path = require ('path');
var gulp = require ('gulp');
var conf = require ('./conf');

var browserSync = require ('browser-sync');

var $ = require ('gulp-load-plugins') ();


gulp.task ('scripts-reload', function () {
    return buildScripts ()
        .pipe (browserSync.stream ());
});

gulp.task ('scripts', function () {
    return buildScripts ();
});

function buildScripts () {
    return gulp
        .src ([
            path.join(conf.paths.src, '/app/**/*.module.js'),
            path.join(conf.paths.src, '/app/**/*.js'),
            path.join(conf.paths.src, '/app/app.js'),
            path.join('!' + conf.paths.src, '/app/**/*Spec.js'),
            path.join('!' + conf.paths.src, '/app/**/*.spec.js'),
            path.join('!' + conf.paths.src, '/app/**/*.mock.js'),
        ])
        .pipe ($.eslint ())
        .pipe ($.eslint.format ())
        .pipe ($.size ());
};
