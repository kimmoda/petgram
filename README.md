
Facebook ID: 1024016557617380

// IOS

cordova plugin add https://github.com/Wizcorp/phonegap-facebook-plugin.git --variable APP_ID="1024016557617380" --variable APP_NAME="Photogram"

// ANDROID

cordova -d plugin add https://github.com/phonegap/phonegap-facebook-plugin.git --variable APP_ID="1024016557617380" --variable APP_NAME="Photogram"
android update project --subprojects --path "platforms/android" --target android-19 --library "CordovaLib"
android update project --subprojects --path "platforms/android" --target android-19 --library "com.phonegap.plugins.facebookconnect/FacebookLib"



cordova plugin add https://github.com/benjie/phonegap-parse-plugin --variable APP_ID=7lWT9DJntSvMKTetpoT0wL79pTG9dk4ob5pztktX --variable CLIENT_KEY=UbrjB5Imc0btrAyoSb83HmCAHmFWc77JEB9AA1to
cordova plugin add https://github.com/ropilz/phonegap-parse-plugin --variable APP_ID=7lWT9DJntSvMKTetpoT0wL79pTG9dk4ob5pztktX --variable CLIENT_KEY=UbrjB5Imc0btrAyoSb83HmCAHmFWc77JEB9AA1to
cordova plugin add https://github.com/benjie/phonegap-parse-plugin --variable APP_ID=7lWT9DJntSvMKTetpoT0wL79pTG9dk4ob5pztktX --variable CLIENT_KEY=UbrjB5Imc0btrAyoSb83HmCAHmFWc77JEB9AA1to
Parse Upload
https://github.com/mellowplace/cordova-parseuploader


Font
Billabong

Sketch Camera
http://www.sketchappsources.com/free-source/680-polaroid-land-camera-sketch-freebie-resource.html

Chave Google
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoFDKBPw/LU16i+3/HmquW09qWk/hMC9LLtig+JdPaxHOr2GP/W9MGoU0Hie7qcXrBf/+LgDIKH26TkhweAYpM4GZd23Dno73gB44RiSFwQt7ncfgyITpg3VI8ZsM43vxyZ7LuAJYoybXYj12TE0+h+cXISurORW33zS7fDD4umhbnwAYvqkhWBIDTEgs0BLNa7JHrIVqHI2ey9/HpN+5r+8Wz3x0S9z/T6B0knij2ywys+/kQCi7HYmCjW0NYlLWm2QCOntR88Wa5nmd8W0b3xrwh5ylvMnSKY60+MsjnhBcSuMcZJ6caTMRuDOGlrelkmYMtcrdlhf65ivLGjhYUwIDAQAB


Key Ashes
keytool -exportcert -alias agfoccus -keystore ~/Documents/PlayStore/agfoccus.jks | openssl sha1 -binary | openssl base64

# Publish Goole Play

Generate Key

keytool -genkey -v -keystore ~/Documents/PlayStore/agfoccus.keystore -alias agfoccus -keyalg RSA -keysize 2048 -validity 10000

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/Documents/PlayStore/agfoccus.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk agfoccus

jarsigner -verify -verbose -certs platforms/android/build/outputs/apk/android-release-unsigned.apk

zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk photogram.apk
