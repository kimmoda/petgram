//'use strict';
//
//// ADD YOUR YANDEX API KEY HERE
//// go here for more info
//// https://tech.yandex.com/translate/
//var YANDEX_API_KEY = 'trnsl.1.1.20151025T112543Z.bcc8dd7f547b4c48.842a7cfc2532cc17d84bba77e4923d9e4b1a63cd';
//
//var gulp           = require('gulp');
//var gutil          = require('gulp-util');
//var argv           = require('yargs').argv;
//var map            = require('map-stream');
//var rename         = require('gulp-rename');
//var traverse       = require('traverse');
//var translate      = require('yandex-translate');
//var transform      = require('vinyl-transform');
//var jsonFormat     = require('gulp-json-format');
//var autoTranslator = require('gulp-auto-translator')
//
//var paths = gulp.paths;
//
//gulp.task('translator', function () {
//    function translate(from, to) {
//
//        return gulp.src([
//                paths.src + '/teste/**/*.js',
//                paths.src + '/teste/**/*.html'
//            ])
//            .pipe(autoTranslator({
//                    yandexApiKey: YANDEX_API_KEY, // Yandex API Key
//                    fromLanguage: from, // Language of your project
//                    replacement: '{{"#CODE#" | translate}}', // Replacement
//                    fileNamePrefix: false,  // I won't use file name prefix.
//                    path: paths.src + '/teste/translate', // Path to a directory in which will locate language files.
//                    createNewFile: true, // true - create copy of current file, false - overwrite it
//                    translate: {
//                        "pt_BR": "pt", // GAT will create new file (./examples/language_pascal/ruRU.json) with a translation by en-ru direction
//                        "en_US": "en" // GAT will create new file (./examples/language_pascal/enUS.json)
//                    }
//                }
//            ));
//    }
//
//    // make sure we have a from and to language
//    if (argv.from !== undefined && argv.to !== undefined) {
//        return translate(argv.from, argv.to);
//
//    } else {
//        gutil.log(gutil.colors.red('Need to specify 2 lanuages e.g. translate --from en --to fr <-- translate en json files to French'));
//    }
//
//});
