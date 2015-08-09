#!/usr/bin/env node

/*

 1) copy cordova for dist
 2) clean platform
 3) copy dist for platform

 */

var fs   = require ("fs");
var path = require ("path");


var cordovaFiles = [
    'cordova-js-src',
    'cordova.js',
    'cordova_plugins.js'
];

var rootdir               = process.argv[2];
var platformDist          = path.resolve (__dirname, '../../dist/');
var currentBuildPlatforms = process.env.CORDOVA_PLATFORMS.split (",");

function copyFile (source, target) {
    return new Promise (function (resolve, reject) {
        var rd = fs.createReadStream (source);
        rd.on ('error', reject);
        var wr = fs.createWriteStream (target);
        wr.on ('error', reject);
        wr.on ('finish', resolve);
        rd.pipe (wr);
    });
}

function copy (from, to) {
    fs.createReadStream (from)
        .pipe (fs.createWriteStream (to));

}

console.log ('Rootdir: ', rootdir);
console.log ('platformDist: ', platformDist);
console.log ('Current build platforms: ', currentBuildPlatforms);


if (rootdir && process.env.TARGET) {

    currentBuildPlatforms.forEach (function (val, index, array) {
        var wwwPath = "";
        switch (val) {
            case "ios":
                wwwPath = "platforms/ios/www/";
                break;
            case "android":
                wwwPath = "platforms/android/assets/www/";
                break;
            default:
                console.log ("Unknown build platform: " + val);
        }
        var destfile = path.join (rootdir, wwwPath + wwwFileToReplace);
        fs.createReadStream (srcfile).pipe (fs.createWriteStream (destfile));
        console.log ("Replaced file: " + destfile + " with file: " + srcfile);
    });
} else {
    console.log ("TARGET environment variable is not set.  Using default values.");
}
