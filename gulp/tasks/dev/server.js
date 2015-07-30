var gulp     = require ('gulp'),
    gutil    = require ('gulp-util'),
    http     = require ('http'),
    ecstatic = require ('ecstatic'),
    open     = require ('open'),
    paths    = require ('../../config');


gulp.task ('server', function () {
    var url = "http://localhost:" + paths.httpPort + "/";

    http.createServer (ecstatic ({
        root: "www"
    })).listen (paths.httpPort);

    gutil.log (gutil.colors.blue ("HTTP server listening on " + paths.httpPort));

    if (paths.open) {
        open (url);
        return gutil.log (gutil.colors.blue ("Opening " + url + " in the browser..."));
    }
});