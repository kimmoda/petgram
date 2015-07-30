var gulp          = require ('gulp'),
    minifyHTML    = require ('gulp-minify-html'),
    templateCache = require ('gulp-angular-templatecache'),
    paths         = require ('../../config'),
    replace       = require ('replace'),
    replaceFiles  = ['./www/js/app.js'];

gulp.task ('templates', function () {
    gulp.src (['./www/module/**/*.html'])
        .pipe (minifyHTML ({quotes: true}))
        .pipe (templateCache ({
        module    : 'cacheviews',
        filename  : 'cacheviews.js',
        root      : 'modules',
        standalone: true
    }))
        .pipe (gulp.dest ('./www/js/'));
});

// Cache Modules
gulp.task ('cacheviews:add', function () {
    return replace ({
        regex      : "//'cacheviews'",
        replacement: "'cacheviews'",
        paths      : replaceFiles,
        recursive  : false,
        silent     : false
    });
});

gulp.task ('cacheviews:remove', function () {
    return replace ({
        regex      : "'cacheviews'",
        replacement: "//'cacheviews'",
        paths      : replaceFiles,
        recursive  : false,
        silent     : false
    });
});