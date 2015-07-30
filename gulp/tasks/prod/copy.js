var gulp  = require ('gulp'),
    paths = require ('../../config');

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
