var gulp          = require('gulp'),
    fs            = require('fs'),
    gutil         = require('gulp-util'),
    bower         = require('bower'),
    concat        = require('gulp-concat'),
    sass          = require('gulp-sass'),
    rename        = require('gulp-rename'),
    sh            = require('shelljs'),
    clean         = require('gulp-clean'),
    inject        = require('gulp-inject'),
    bowerFiles    = require('main-bower-files'),
    gettext       = require('gulp-angular-gettext'),
    wrap          = require('gulp-wrap'),
    extend        = require('gulp-extend'),
    ngAnnotate    = require('gulp-ng-annotate'),
    uglify        = require('gulp-uglify'),
    jshint        = require('gulp-jshint'),
    stylish       = require('jshint-stylish'),
    minifyHTML    = require('gulp-minify-html'),
    minifyCSS     = require('gulp-minify-css'),
    templateCache = require('gulp-angular-templatecache'),
    replace       = require('replace'),
    usemin        = require('gulp-usemin'),
    header        = require('gulp-header'),
    imagemin      = require('gulp-imagemin'),
    stripDebug    = require('gulp-strip-debug'),
    rev           = require('gulp-rev'),
    karma         = require('gulp-karma'),
    iife          = require("gulp-iife"),
    runSequence   = require('run-sequence'),
    rev           = require('gulp-rev'),
    tag_version   = require('gulp-tag-version'),
    paths         = require('./config'),
    replaceFiles  = ['./www/js/app.js'],
    config        = ['./www/js/config.js'],
    facebook      = ['./www/module/user/config/user.facebook.js'];


// Master Tasks
gulp.task('default', [
    'sass',
    'translate',
    'inject'
]);

gulp.task('dev', function (cb) {
    runSequence(
        // 'bower',
        'sass',
        'translate',
        'copy:font',
        'inject',
        cb);
});

gulp.task('prod', function (cb) {
    return runSequence(
        'templates',
        'dev',
        'clean',
        'copy',
        'cacheapp:add',
        'cachemodule:add',
        'server:prod',
        'usemin',
        'cacheapp:remove',
        'cachemodule:remove',
        'server:dev',
        cb
    );
});

gulp.task('clean', function () {
    return gulp.src(paths.dist, {read: false})
        .pipe(clean());
});

gulp.task('server:prod', [
    'cache:prod',
    'blog:prod',
]);

gulp.task('server:dev', [
    'cache:dev',
    'blog:dev'
]);

// Inject Files
gulp.task('inject', function () {
    return gulp.src(paths.src.index)
        .pipe(inject(gulp.src(bowerFiles(), {read: false}), {
            name    : 'bower',
            relative: true
        }))
        .pipe(inject(gulp.src(paths.src.js, {read: false}), {relative: true}))
        .pipe(inject(gulp.src(paths.src.css, {read: false}), {relative: true}))
        .pipe(gulp.dest(paths.source));
});

// Sass
gulp.task('sass', function (done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass())
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

// Watch
gulp.task('watch', function () {
    gulp.watch(paths.src.sass, ['sass']);
    gulp.watch(paths.libs, ['inject']);
    gulp.watch(paths.src.js, [
        'inject',
        'translate'
    ]);
});


// Install
gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});


// Git Check
gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});


// Translate
gulp.task('gettext:po', function () {
    return gulp.src(paths.src.translate)
        .pipe(gettext.extract('template.pot', {
            // options to pass to angular-gettext-tools...
        }))
        .pipe(gulp.dest('./translate/'));
});

gulp.task('gettext:compile', function () {
    return gulp.src('translate/*.po') // Stream PO translation files.
        .pipe(gettext.compile({format: 'json'})) // Compile to json
        .pipe(extend('.tmp.json')) // use .json extension for gulp-wrap to load json content
        .pipe(wrap( // Build the translation module using gulp-wrap and lodash.template
            '\'use strict\';\n' +
            'angular.module(\'translate.app\',[\'ionic\'])\n' +
            '.run(function (gettextCatalog) {\n' +
            '<% var langs = Object.keys(contents); var i = langs.length; while (i--) {' +
            'var lang = langs[i]; var translations = contents[lang]; %>' +
            '  gettextCatalog.setStrings(\'<%= lang %>\', <%= JSON.stringify(translations, undefined, 2) %>);\n' +
            '<% }; %>' +
            '});'))
        //.pipe (ngAnnotate ())
        //.pipe (uglify ())
        .pipe(rename('translate.js')) // Rename to final javascript filename
        //.pipe(iife())
        .pipe(gulp.dest(paths.source + '/js/'));
});

gulp.task('translate', [
    'gettext:po',
    'gettext:compile'
]);

// Lint

gulp.task('jshint', function () {
    return gulp.src(paths.src.js)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

// Templates
gulp.task('template:app', function () {
    gulp.src(['./www/app/**/*.html'])
        .pipe(minifyHTML({quotes: true}))
        .pipe(templateCache({
            module    : 'cacheapp',
            filename  : 'cacheapp.js',
            root      : 'app',
            standalone: true
        }))
        //.pipe(iife())
        .pipe(gulp.dest('./www/js/'));
});

gulp.task('template:module', function () {
    gulp.src(['./www/module/**/*.html'])
        .pipe(minifyHTML({quotes: true}))
        .pipe(templateCache({
            module    : 'cachemodule',
            filename  : 'cachemodule.js',
            root      : 'module',
            standalone: true
        }))
        //.pipe(iife())
        .pipe(gulp.dest('./www/js/'));
});

gulp.task('templates', [
    'template:app',
    'template:module'
]);

// Cache Modules
// ADD
gulp.task('cacheapp:add', function () {
    return replace({
        regex      : "//'cacheapp'",
        replacement: "'cacheapp'",
        paths      : replaceFiles,
        recursive  : false,
        silent     : false
    });
});

gulp.task('cachemodule:add', function () {
    return replace({
        regex      : "//'cachemodule'",
        replacement: "'cachemodule'",
        paths      : replaceFiles,
        recursive  : false,
        silent     : false
    });
});

// REMOVE
gulp.task('cacheapp:remove', function () {
    return replace({
        regex      : "'cacheapp'",
        replacement: "//'cacheapp'",
        paths      : replaceFiles,
        recursive  : false,
        silent     : false
    });
});
gulp.task('cachemodule:remove', function () {
    return replace({
        regex      : "'cachemodule'",
        replacement: "//'cachemodule'",
        paths      : replaceFiles,
        recursive  : false,
        silent     : false
    });
});

// Copy
gulp.task('copy', function () {
    // Images
    gulp.src(paths.source + '/img/**').pipe(gulp.dest(paths.dist + '/img'));

    // Deploy
    gulp.src(paths.source + '/fonts/**').pipe(gulp.dest(paths.dist + '/fonts'));

});

// Copy Fonts
gulp.task('copy:font', function () {

    // Ionic
    gulp.src(paths.source + '/lib/ionic/fonts/**').pipe(gulp.dest(paths.source + '/fonts'));

    // Ionic Icons
    gulp.src(paths.source + '/lib/simple-line-icons/fonts/**').pipe(gulp.dest(paths.source + '/fonts'));


});

// Image Mim

gulp.task('img', function () {
    return gulp.src('./www/img/**/*')
        //.pipe(imageResize({width: 1080}))
        .pipe(imagemin({
            optimizationLevel: 4,
            progressive      : true,
            interlace        : true
        }))
        .pipe(gulp.dest(paths.dist + '/img'));
});

gulp.task('img_x2', function () {
    return gulp.src('./www/img_x2/**/*')
        //.pipe(imageResize({width: 1080}))
        .pipe(imagemin({
            optimizationLevel: 4,
            progressive      : true,
            interlace        : true
        }))
        .pipe(gulp.dest(paths.dist + '/img_x2'));
});

// Minify
// Get copyright using NodeJs file system
var getCopyright = function () {
    return fs.readFileSync('./LICENSE.md');
};


gulp.task('usemin', function () {
    return gulp
        .src(paths.source + '/index.html')
        .pipe(usemin({
            css      : [
                minifyCSS()
            ],
            cssvendor: [
                minifyCSS()
            ],
            html     : [
                minifyHTML({
                    empty: true
                })
            ],
            jsvendor : [
                // jshint.reporter ('default'),
                uglify(),
                rev()
            ],
            js       : [
                stripDebug(),
                //iife (),
                jshint.reporter('default'),
                ngAnnotate({
                    add: true
                }),
                uglify(),
                header(getCopyright(), {
                    version: paths.version
                }),
                rev()
            ]
        }))
        .pipe(gulp.dest(paths.dist));
});

// Replaces
// Cache Modules
gulp.task('cache:prod', function () {
    return replace({
        regex      : paths.const.api.dev,
        replacement: paths.const.api.prod,
        paths      : config,
        recursive  : false,
        silent     : false
    });
});

gulp.task('cache:dev', function () {
    return replace({
        regex      : paths.const.api.prod,
        replacement: paths.const.api.dev,
        paths      : config,
        recursive  : false,
        silent     : false
    });
});

// Blog
gulp.task('blog:prod', function () {
    return replace({
        regex      : paths.const.blog.dev,
        replacement: paths.const.blog.prod,
        paths      : config,
        recursive  : false,
        silent     : false
    });
});

gulp.task('blog:dev', function () {
    return replace({
        regex      : paths.const.blog.prod,
        replacement: paths.const.blog.dev,
        paths      : config,
        recursive  : false,
        silent     : false
    });
});

// Imagemin images and ouput them in dist
gulp.task('imagemin', ['clean'], function () {
    gulp.src(paths.images)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.dist + 'img'));
});

// Karma Test
gulp.task('test', function () {
    return
    gulp.src(config.src.js)
        .pipe(karma({
            configFile: './karma.conf.js',
            action    : run
        }))
        .on('error', function (err) {
            throw err;
        });
});


///////////////////////////////////////////////////////
// BUILD TASKS
///////////////////////////////////////////////////////

// set the debuggable flag in the AndroidManifest.xml for release or debug
// move the manifest file into the build path
gulp.task('process-android-build-config', function () {
    if (!argv.android) {
        return false;
    }

    var srcManifestFile  = ['./lib/AndroidManifest.xml'];
    var destManifestFile = './platforms/android/';
    return gulp.src(srcManifestFile)
        .pipe(preprocess({context: {RELEASE: argv.release}}))
        .pipe(gulp.dest(destManifestFile));
});

// build a debug native version after compiling
// TODO: add 'compile' back as a dependency when sync/async issues fixed
gulp.task('build-debug', ['process-android-build-config'], function () {
    // do the ionic ios build
    if (argv.ios) {
        if (exec('ionic build ios').code !== 0) {
            echo('Error: iOS build failed');
            exit(1);
        }
    }
    // do the ionic android build
    if (argv.android) {
        if (exec('ionic build android').code !== 0) {
            echo('Error: Android build failed');
            exit(1);
        }
    }
});

// build a release native version after compiling
// TODO: add 'compile' back as a dependency when sync/async issues fixed
gulp.task('build-release', ['process-android-build-config'], function () {
    // remove the console plugin
    exec("cordova plugin rm org.apache.cordova.console");

    // do the ionic ios build
    if (argv.ios) {
        if (exec('cordova build --release ios').code !== 0) {
            echo('Error: iOS build failed');
            exit(1);
        }
    }

    // do the ionic android build
    if (argv.android) {
        // clean the android build folders:
        gulp.src('./platforms/android/ant-build/', {read: false})
            .pipe(clean({force: true}));
        gulp.src('./platforms/android/ant-gen/', {read: false})
            .pipe(clean({force: true}));
        gulp.src('./platforms/android/out/', {read: false})
            .pipe(clean({force: true}));

        if (exec('cordova build --release android').code !== 0) {
            echo('Error: Android build failed');
            exit(1);
        }
        else {
            // copy the release output to release-builds/
            // TODO: change the below to match your expected release filename
            return gulp.src(['./platforms/android/ant-build/release.apk'])
                .pipe(rename(function (path) {
                    // see https://github.com/hparra/gulp-rename for info on rename fields
                    path.basename += moment().format('MMDDYYYY-hhmmss');
                }))
                // do any other processing needed
                .pipe(gulp.dest(dest_paths.release_builds));
        }
    }

    // re-add the console plugin
    // exec("cordova plugin add org.apache.cordova.console");
});

// fire up the emulator, depending on what flags passed
gulp.task('run-emulator', function () {
    // should we trigger the emulator?
    if (!argv.run) {
        return false;
    }

    // start the ios emulator
    if (argv.ios) {
        if (exec('ionic emulate ios').code !== 0) {
            echo('Error: iOS run failed');
            exit(1);
        }
    }

    // start the android emulator
    if (argv.android) {
        if (exec('ionic emulate android').code !== 0) {
            echo('Error: Android run failed');
            exit(1);
        }
    }
});

gulp.task('build', function () {
    // are we building a debug or release version?
    if (argv.release) {
        runSequence('build-release', 'run-emulator');
    }
    else {
        runSequence('build-debug', 'run-emulator');
    }
});

///////////////////////////////////////////////////////
// MISC TASKS
///////////////////////////////////////////////////////

// used for bumping versions and getting the version info
// `fs` is used instead of require to prevent caching in watch (require caches)
var fs             = require('fs');
var getPackageJson = function () {
    return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};

/**
 * Bumping version number and tagging the repository with it.
 *
 * Semantic versioning bump
 * Please read http://semver.org/
 * **************************************************
 * MAJOR ("major") version when you make incompatible API changes -- major: 1.0.0
 * MINOR ("minor") version when you add functionality in a backwards-compatible manner -- minor: 0.1.0
 * PATCH ("patch") version when you make backwards-compatible bug fixes. -- patch: 0.0.2
 * PRERELEASE ("prerelease") a pre-release version -- prerelease: 0.0.1-2
 * **************************************************
 *
 * You can use the commands
 *
 *     gulp patch     # makes v0.1.0 → v0.1.1
 *     gulp feature   # makes v0.1.1 → v0.2.0
 *     gulp release   # makes v0.2.1 → v1.0.0
 *     gulp prerelease # makes v0.2.1-2 → v1.0.0-2
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */
function inc(importance) {
    var deferred = Q.defer();
    // reget package
    var pkg = getPackageJson();
    // get existing version
    var oldVer = pkg.version;
    // increment version
    var newVer = semver.inc(oldVer, importance);
    // json filter
    var jsonFilter = filter('**/*.json');

    // TODO: change /platforms/ios/project/ in the below to match your Cordova project name

    // bump the version number in the xml config files
    replacement  = 'sed -i \'\' -e \'s/version=\"' + oldVer + '\"/version=\"' + newVer + '\"/\' ./config.xml'
    exec(replacement);
    replacement2 = 'sed -i \'\' -e \'s/version=\"' + oldVer + '\"/version=\"' + newVer + '\"/\' ./platforms/ios/project/config.xml'
    exec(replacement2);
    replacement3 = 'sed -i \'\' -e \'s/android:versionName=\"' + oldVer + '\"/android:versionName=\"' + newVer + '\"/\' ./lib/AndroidManifest.xml'
    exec(replacement3);

    // get all the files to bump version in
    gulp.src([
        './package.json',
        './bower.json',
        './config.xml',
        './platforms/ios/project/config.xml',
        './lib/AndroidManifest.xml'
    ])
        // filter only the json files
        .pipe(jsonFilter)
        // bump the version number in the json files
        .pipe(bump({version: newVer}))
        // save json files back to filesystem
        .pipe(gulp.dest('./'))
        // restore full stream
        .pipe(jsonFilter.restore())
        // commit the changed version number
        .pipe(git.commit('bump app version to ' + newVer))
        // read only one file to get the version number
        .pipe(filter('package.json'))
        // **tag it in the repository**
        .pipe(tag_version());

    return deferred.promise;
}

gulp.task('patch', function () {
    return inc('patch');
})
gulp.task('feature', function () {
    return inc('minor');
})
gulp.task('release', function () {
    return inc('major');
})
gulp.task('prerelease', function () {
    return inc('prerelease');
})

// run source scripts through JSHint
gulp.task('lint', function () {
    return gulp.src(paths.src.js)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});
