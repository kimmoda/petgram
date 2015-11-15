/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

var gutil = require('gulp-util');

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
    version  : '1.0.0',
    src      : 'www',
    lib      : 'www/lib',
    e2e      : 'e2e',
    dist     : 'dist',
    scss     : 'scss',
    translate: 'translate',
    tmp      : 'tmp'
};

/**
 *  Wiredep is the lib which inject bower dependencies in your project
 *  Mainly used to inject script tags in the index.html but also used
 *  to inject css preprocessor deps and js files in karma
 */
exports.wiredep = {
    directory: 'www/lib'
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = errorHandler;

function errorHandler(title) {
    'use strict';

    return function (err) {
        gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
        this.emit('end');
    };
};
