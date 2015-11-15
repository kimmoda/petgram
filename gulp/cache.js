'use strict';
var path = require ('path');
var gulp = require ('gulp');
var replace = require ('replace');
var paths = gulp.paths;
var replaceFiles = [paths.src + '/js/app.js'];

// Cache Modules
// ADD
gulp.task('cacheapp:add', function (done) {
  replace ({
    regex: "//'app.cache'",
    replacement: "'app.cache'",
    paths: replaceFiles,
    recursive: false,
    silent: false
  })
  .on('end', done);
});

// REMOVE
gulp.task('cacheapp:remove', function (done) {
  replace ({
    regex: "'app.cache'",
    replacement: "//'app.cache'",
    paths: replaceFiles,
    recursive: false,
    silent: false
  })
  .on('end', done);
});
