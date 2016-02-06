'use strict';
// ADD YOUR YANDEX API KEY HERE
// User gulp translate --from en --to pt
// go here for more info
// npm install -S gulp-util yargs map-stream gulp-rename traverse yandex-translate vinyl-transform gulp-json-format
// https://tech.yandex.com/translate/doc/dg/concepts/langs-docpage/
// https://tech.yandex.com/translate/
const YANDEX_API_KEY = 'trnsl.1.1.20151231T023309Z.303cfcb0d309b4d4.c701d72bbd3edb7916cc6759995de6191b63993b';

const gulp       = require('gulp');
const gutil      = require('gulp-util');
const argv       = require('yargs').argv;
const map        = require('map-stream');
const rename     = require('gulp-rename');
const traverse   = require('traverse');
const translate  = require('yandex-translate')(YANDEX_API_KEY);
const transform  = require('vinyl-transform');
const jsonFormat = require('gulp-json-format');
const conf       = require('./conf');
const paths      = conf.paths;

gulp.task('translate', function () {
    var translateFile = transform(function(filename) {
        return map(function(data, done) {
            var j = JSON.parse(data);
            var translateCount = 0;
            var appTranslated = traverse(j).forEach(function(x) {
                if(typeof x !== 'object') {
                    var self = this;
                    translateCount++;
                    translate(x, { to: argv.to, key: YANDEX_API_KEY }, function(err, res) {
                        self.update(res.text.toString());
                        translateCount--;
                        if(translateCount === 0) {
                            var finishedJSON = JSON.stringify(appTranslated);
                            gutil.log(gutil.colors.green('Translated ' + filename));
                            done(null, finishedJSON);
                        }
                    });
                }
            });
        })
    });

    // make sure we have a from and to language
    if(argv.from !== undefined && argv.to !== undefined) {
        return gulp.src([
                paths.src + '/app/**/il8n/' + argv.from + '.json',
            ])
            .pipe(translateFile)
            .pipe(jsonFormat(4))
            .pipe(rename({
                basename: argv.to,
            }))
            .pipe(gulp.dest(paths.src + '/app'));
    }
    else {
        gutil.log(gutil.colors.red('Need to specify 2 lanuages e.g. translate --from en --to fr <-- translate en json files to French'));
    }
});