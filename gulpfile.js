var gulp          = require ('gulp'),
    fs            = require ('fs'),
    gutil         = require ('gulp-util'),
    bower         = require ('bower'),
    concat        = require ('gulp-concat'),
    sass          = require ('gulp-sass'),
    rename        = require ('gulp-rename'),
    sh            = require ('shelljs'),
    inject        = require ('gulp-inject'),
    bowerFiles    = require ('main-bower-files'),
    gettext       = require ('gulp-angular-gettext'),
    wrap          = require ('gulp-wrap'),
    extend        = require ('gulp-extend'),
    ngAnnotate    = require ('gulp-ng-annotate'),
    uglify        = require ('gulp-uglify'),
    rename        = require ('gulp-rename'),
    jshint        = require ('gulp-jshint'),
    stylish       = require ('jshint-stylish'),
    minifyHTML    = require ('gulp-minify-html'),
    minifyCSS     = require ('gulp-minify-css'),
    templateCache = require ('gulp-angular-templatecache'),
    replace       = require ('replace'),
    usemin        = require ('gulp-usemin'),
    header        = require ('gulp-header'),
    imagemin      = require ('gulp-imagemin'),
    stripDebug    = require ('gulp-strip-debug'),
    rev           = require ('gulp-rev'),
    karma         = require ('gulp-karma'),
    iife          = require ("gulp-iife"),
    runSequence   = require ('run-sequence'),
    rev           = require ('gulp-rev'),
    paths         = require ('./config'),
    replaceFiles  = ['./www/js/app.js'];


// Master Tasks
gulp.task ('default', ['sass',
                       'inject'
]);

gulp.task ('dev', function (cb) {
    runSequence (
        // 'bower',
        'sass',
        'translate',
        'inject',
        cb);
});

gulp.task ('prod', function (cb) {
    return runSequence (
        'templates',
        'dev',
        'clean',
        'copy',
        'cacheviews:add',
        'server:prod',
        'usemin',
        'cacheviews:remove',
        'server:dev',
        cb
    );
});

gulp.task ('server:prod', ['cache:prod',
                           'blog:prod',
                           'facebook:prod'
]);

gulp.task ('server:dev', ['cache:dev',
                          'blog:dev',
                          'facebook:dev'
]);

// Inject Files
gulp.task ('inject', function () {
    return gulp.src (paths.src.index)
        .pipe (inject (gulp.src (bowerFiles (), {read: false}), {
        name    : 'bower',
        relative: true
    }))
        .pipe (inject (gulp.src (paths.src.js, {read: false}), {relative: true}))
        .pipe (inject (gulp.src (paths.src.css, {read: false}), {relative: true}))
        .pipe (gulp.dest (paths.source));
});

// Sass
gulp.task ('sass', function (done) {
    gulp.src ('./scss/ionic.app.scss')
        .pipe (sass ({
        errLogToConsole: true
    }))
        .pipe (gulp.dest ('./www/css/'))
        // .pipe(minifyCss({
        //   keepSpecialComments: 0
        // }))
        // .pipe(rename({ extname: '.min.css' }))
        // .pipe(gulp.dest('./www/css/'))
        .on ('end', done);
});

// Watch
gulp.task ('watch', function () {
    gulp.watch (paths.sass, ['sass']);
});


// Install
gulp.task ('install', ['git-check'], function () {
    return bower.commands.install ()
        .on ('log', function (data) {
        gutil.log ('bower', gutil.colors.cyan (data.id), data.message);
    });
});


// Git Check
gulp.task ('git-check', function (done) {
    if (!sh.which ('git')) {
        console.log (
            '  ' + gutil.colors.red ('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan ('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan ('gulp install') + '\' again.'
        );
        process.exit (1);
    }
    done ();
});


// Translate
gulp.task ('gettext:po', function () {
    return gulp.src ([
        paths.source + '/js/*.js',
        paths.source + '/module/**/*.js',
        paths.source + '/module/**/*.html'
    ])
        .pipe (gettext.extract ('template.pot', {
        // options to pass to angular-gettext-tools...
    }))
        .pipe (gulp.dest ('./po/'));
});

gulp.task ('gettext:compile', function () {
    return gulp.src ('po/*.po') // Stream PO translation files.
        .pipe (gettext.compile ({format: 'json'})) // Compile to json
        .pipe (extend ('.tmp.json')) // use .json extension for gulp-wrap to load json content
        .pipe (wrap ( // Build the translation module using gulp-wrap and lodash.template
        '\'use strict\';\n\n' +
        'angular.module(\'translate\',[]).run(function (gettextCatalog) {\n' +
        '/* jshint -W100,-W109 */\n' +
        '<% var langs = Object.keys(contents); var i = langs.length; while (i--) {' +
        'var lang = langs[i]; var translations = contents[lang]; %>' +
        '  gettextCatalog.setStrings(\'<%= lang %>\', <%= JSON.stringify(translations, undefined, 2) %>);\n' +
        '<% }; %>' +
        '/* jshint +W100,+W109 */\n' +
        '});'))
        .pipe (ngAnnotate ())
        .pipe (uglify ())
        .pipe (rename ('translations.js')) // Rename to final javascript filename
        .pipe (gulp.dest (paths.source + '/js/'));
});

gulp.task ('translate', [
    'gettext:po',
    'gettext:compile'
]);

// Lint

gulp.task ('jshint', function () {
    return gulp.src (paths.src.js)
        .pipe (jshint ())
        .pipe (jshint.reporter (stylish));
});

// Templates
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

// Copy
gulp.task ('copy', function () {

    gulp.src (paths.source + '/img/**').pipe (gulp.dest (paths.dist + '/img'));

    // Ionic
    gulp.src (paths.source + '/lib/ionic/fonts/**').pipe (gulp.dest (paths.dist + '/fonts'));

    // Style
    //gulp.src (paths.source + '/lib/select2/*.png').pipe (gulp.dest (paths.dist + '/styles'));

    // jquery ui themes
    //gulp.src (paths.source + '/lib/jquery-ui/themes/redmond/images/**').pipe (gulp.dest (paths.dist + '/styles/images'));

    // forms validate
    //gulp.src (paths.source + '/formsValidate.js').pipe (gulp.dest (paths.dist + '/'));

    // Deploy
    gulp.src (paths.source + '/fonts/**').pipe (gulp.dest (paths.dist + '/fonts'));

});

// Image Mim

gulp.task ('img', function () {
    return gulp.src ('./www/img/**/*')
        //.pipe(imageResize({width: 1080}))
        .pipe (imagemin ({
        optimizationLevel: 4,
        progressive      : true,
        interlace        : true
    }))
        .pipe (gulp.dest (paths.dist + '/img'));
});

gulp.task ('img_x2', function () {
    return gulp.src ('./www/img_x2/**/*')
        //.pipe(imageResize({width: 1080}))
        .pipe (imagemin ({
        optimizationLevel: 4,
        progressive      : true,
        interlace        : true
    }))
        .pipe (gulp.dest (paths.dist + '/img_x2'));
});

// Minify 
// Get copyright using NodeJs file system
var getCopyright = function () {
    return fs.readFileSync ('./LICENSE.md');
};


gulp.task ('usemin', function () {
    return gulp
        .src (paths.source + '/index.html')
        .pipe (usemin ({
        css      : [
            minifyCSS ()
        ],
        cssvendor: [
            minifyCSS ()
        ],
        html     : [minifyHTML ({
            empty: true
        })
        ],
        jsvendor : [
            // jshint.reporter ('default'),
            uglify (),
            rev ()
        ],
        js       : [
            stripDebug (),
            jshint.reporter ('default'),
            ngAnnotate ({
                add: true
            }),
            iife ({
                //useStrict       : false,
                //trimCode        : false,
                //prependSemicolon: false
            }),
            uglify (),
            header (getCopyright (), {
                version: paths.version
            }),
            rev ()
        ]
    }))
        .pipe (gulp.dest (paths.dist));
});

// Replaces
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

// Karma Test
gulp.task ('test', function () {
    return
    gulp.src (config.src.js)
        .pipe (karma ({
        configFile: './karma.conf.js',
        action    : run
    }))
        .on ('error', function (err) {
        throw err;
    });
});