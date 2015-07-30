var gulp     = require ('gulp'),
    replace  = require ('replace'),
    paths    = require ('../../config'),
    config   = ['./www/js/config.js'],
    facebook = ['./www/module/user/config/user.facebook.js'];


// Cache Modules
gulp.task ('cache:prod', function () {
    return replace ({
        regex      : paths.const.api.dev,
        replacement: paths.const.api.prod,
        paths      : config,
        recursive  : false,
        silent     : false
    });
});

gulp.task ('cache:dev', function () {
    return replace ({
        regex      : paths.const.api.prod,
        replacement: paths.const.api.dev,
        paths      : config,
        recursive  : false,
        silent     : false
    });
});

// Blog
gulp.task ('blog:prod', function () {
    return replace ({
        regex      : paths.const.blog.dev,
        replacement: paths.const.blog.prod,
        paths      : config,
        recursive  : false,
        silent     : false
    });
});

gulp.task ('blog:dev', function () {
    return replace ({
        regex      : paths.const.blog.prod,
        replacement: paths.const.blog.dev,
        paths      : config,
        recursive  : false,
        silent     : false
    });
});

// Blog
gulp.task ('facebook:prod', function () {
    return replace ({
        regex      : paths.const.facebook.dev,
        replacement: paths.const.facebook.prod,
        paths      : facebook,
        recursive  : false,
        silent     : false
    });
});

gulp.task ('facebook:dev', function () {
    return replace ({
        regex      : paths.const.facebook.prod,
        replacement: paths.const.facebook.dev,
        paths      : facebook,
        recursive  : false,
        silent     : false
    });
});

gulp.task ('server:prod', ['cache:prod', 'blog:prod', 'facebook:prod']);

gulp.task ('server:dev', ['cache:dev', 'blog:dev', 'facebook:dev']);