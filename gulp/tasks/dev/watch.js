var gulp  = require ('gulp'),
    paths = require ('../../config');


gulp.task ('watch', function () {
    gulp.watch (paths.src.sass, ['sass']);
});

//
//gulp.task ('dev:watch', function () {
//    // FONTS
//    watch (paths.src.fonts, function () {
//        gulp.start ('dev:processFonts');
//    });
//
//    // IMGS
//    watch (paths.src.imgs, function () {
//        gulp.start ('dev:processImgs');
//    });
//
//    // CSS
//    var cssSources = [
//        paths.src.css,
//        paths.src.assetsFile
//    ];
//
//    watch (cssSources, function () {
//        gulp.start ('dev:processCSS');
//    });
//
//    // JS
//    var jsSources = [
//        paths.src.js,
//        paths.src.assetsFile
//    ].concat (_.values (paths.configFiles));
//
//    watch (jsSources, function () {
//        gulp.start ('dev:processJS');
//    });
//
//    // INJECT
//    var injectSources = [
//        paths.src.assetsFile,
//        paths.src.index
//    ];
//
//    watch (injectSources, function () {
//        gulp.start ('dev:inject');
//    });
//});
