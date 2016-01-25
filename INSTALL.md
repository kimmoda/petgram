##Getting Started with Ionic Framework

[Ionic](http://ionicframework.com/) is a powerful, beautiful and easy to use open source front-end framework built on top of  [AngularJs](https://angularjs.org/) (a client-side javascript framework), [Sass](http://sass-lang.com/) Syntactically Awesome Style Sheets [Apache Cordova](http://cordova.apache.org/) for and developing hybrid (cross platform) mobile apps.   

> Ionic's ultimate goal is to make it easier to develop native mobile apps with HTML5, also known as Hybrid apps. 
  
Install nodejs: http://nodejs.org/ 

        npm install -g cordova ionic

####Full list of [Ionic starter templates](https://github.com/driftyco?utf8=%E2%9C%93&query=ionic-starter)

Start with a blank Ionic template
        
$ ionic start appName blank
        
Start with an Ionic tabs template
        
        $ ionic start appName tabs

Start with a side menu Ionic template
        
        $ ionic start myApp sidemenu

Start with an Ionic maps template
        
        $ ionic start myApp maps

Start with an Ionic push notification template
        
        $ ionic start myApp push

Start with an Ionic analytics template
        
        $ ionic start myApp analytics

Start with an Ionic salesforce template
        
        $ ionic start myApp salesforce

Start with an app containing ionic.io services
        
        $ ionic start myApp io

Start with an app containing Ionic deploy
        
        $ ionic start myApp deploy

A test of different kinds of page navigation
      
        $ ionic start myApp tests

A complex list starter template
        
        $ ionic start myApp complex list

####Build and run app on iOS

1. Install iOS emulator
2. Change directory to app directory
3. Add iOS platform
4. Build app for iOS
5. Emulate app
6. Or run app on connected iOS device  

        $ sudo npm install -g ios-sim 
        $ cd appName
        $ ionic platform add ios
        $ ionic build ios
        $ ionic emulate ios
        $ ionic run ios
 
##Android Emulator setup on Mac:
The follow instrustions should help you get the Android emulator set up on mac.

######Install 'ant'  
  
Get the latest version of Apache Ant (binary distribution) from its official website (example link)
Unzip the binary distribution and rename the folder to “ant” change directory to the directory containing "ant" [Download Ant](http://ant.apache.org/bindownload.cgi)
  
######Move the folder to “/usr/local”. terminal commands:  

        $ mv ant /usr/local
        $ cd /usr/local
        $ ln -s ant ant

######Add the following lines of code to your bash_profile file. ~/.bash_profile  
  
        $ export ANT_HOME=/usr/local/ant
        $ export PATH=${PATH}:${ANT_HOME}/bin

######Then run this command  
  
        $ source ~/.bash_profile

##Adding an image  

######app.js  

```js
        .config(function($stateProvider, $urlRouterProvider, $compileProvider) {
        $urlRouterProvider.otherwise('/');
        $compileProvider.imgSrcSanitizationWhitelist('img/');
```

######.html    
```html
        ng-src="img/[image path]"
```

##Known Errors  
  
#####Error initilizing Cordova: Class not found  
  
        cordova platform rm android
        cordova platform add android
        
#####External linking  

Run command to install inappbrowser plugin more information here http://intown.biz/2014/03/30/cordova-ionic-links-in-browser/  
  
        $sudo cordova plugin add org.apache.cordova.inappbrowser
        
#####Code sample
  
        onClick="window.open(url, target, options)";
        onClick="window.open('https://mobile.twitter.com/catholictt', '_system', 'location=yes')"
  
* ref: Reference to the InAppBrowser window. (InAppBrowser)
* url: The URL to load (String). Call encodeURI() on this if the URL contains Unicode characters.
* target: The target in which to load the URL, an optional parameter that defaults to _self. (String)
    * _self: Opens in the Cordova WebView if the URL is in the white list, otherwise it opens in the InAppBrowser.  
    * _blank: Opens in the InAppBrowser.  
    * _system: Opens in the system's web browser.  
    * options: Options for the InAppBrowser. Optional, defaulting to: location=yes. (String)  
  
The options string must not contain any blank space, and each feature's name/value pairs must be separated by a comma. Feature names are case insensitive. All platforms support the value below:  
  
location: Set to yes or no to turn the InAppBrowser's location bar on or off.

##Other useful information 
  
Lock app's orientation in landscape mode:
```xml
<preference name="orientation" value="landscape" />
```
Lock app's orientation in portrait mode:
```xml
<preference name="orientation" value="portrait" />
```
Set app's orientation to default:
```xml
<preference name="orientation" value="default" />
```
Display status bar:
  
      <preference name="fullscreen" value="false" />
        
##Fix ios header status bar problem     
        
        $cordova plugin add org.apache.cordova.device

##chromeview
        https://github.com/thedracle/cordova-android-chromeview
        
        
##Postision content at the bottom of the sreen in iconic

First you have to stop the content area from scrolling.
  
html:
  
~~~html 
<ion-content scroll="false">
~~~
Next what you want to do is set the a height of 100% to the scroll class which usually wraps your main content and position your content when you want it.  
  
css: 
  
~~~css
.some-content{
  width: 96%;
  margin: 0 2%;
  position: absolute;
  bottom: 100px;
}
.scroll{
  height:100%;
}
~~~    
  
##Deploy to iOS

        npm install -g ios-deploy
        
cordova plugin rm https://github.com/driftyco/ionic-plugins-keyboard.git        
cordova plugin add https://github.com/driftyco/ionic-plugins-keyboard.git


Status
https://developer.apple.com/appstore/resources/approval/index.html

##Update Apache Cordova
        
        sudo npm update -g cordova ionic

'npm update' is a built in function for node that will any packages you have installed. If things aren't updating correctly, you can always run

        sudo npm uninstall -g ionic && sudo npm install ionic
        
If you are experiencing any issues you may need to uninstall you plugins first before you update.
[More information here](http://stackoverflow.com/questions/22427842/how-to-update-cordova-phonegap-plugin-in-my-project)

Istall gulp

sudo npm install -g gulp
        
gulp version 

gulp -v

#Adding and removing plugins  
Adding

        ionic plugin add <plugin-location>
example

        ionic plugin add com.ionic.keyboard
         
removing 

        ionic plugin rm <plugin-location>

example  

        ionic plugin add com.ionic.keyboard
         
##iOS 8 status bar issue

.platform-ios .menu .list, .platform-ios .nav-bar{ margin-top: 20px; background-color: #2C77BD;}
.platform-ios .panel .view{ background-color: #2C77BD;}
.platform-ios .scroll-content{ margin-top: 20px; overflow: auto;}
.platform-ios .list a:first-child{ border-top: none;}

##SASS
Using Sass

By default, starter projects are hooked up to Ionic's precompiled CSS file, which is found in the project's www/lib/ionic/css directory, and is linked to the app in the head of the root index.html file. However, Ionic projects can also be customized using Sass, which gives developers and designers "superpowers" in terms of creating and maintaining CSS. Below are two ways to setup Sass for your Ionic project (the ionic setup sass command simply does the manual steps for you). Once Sass has been setup for your Ionic project, then the ionic serve command will also watch for Sass changes.

###Setup Sass Automatically
        
        ionic setup sass

###Setup Sass Manually

Run npm install from the working directory of an Ionic project. This will install gulp.js and a few handy tasks, such as gulp-sass and gulp-minify-css.
Remove <link href="lib/ionic/css/ionic.css" rel="stylesheet"> from the <head> of the root index.html file.
Remove <link href="css/style.css" rel="stylesheet"> from the <head> of the root index.html file.
Add <link href="css/ionic.app.css" rel="stylesheet"> to the <head> of the root index.html file.
In the ionic.project file, add the JavaScript property "gulpStartupTasks": ["sass", "watch"] (this can also be customized to whatever gulp tasks you'd like).

##Installing sass
Install  

        gem install sass
or 

        sudo gem install sass
        
How to watch files

        sass --watch path/sass-directory

watch directory 

        sass --watch path/sass-directory:path/css-directory

watch file

        sass --watch path/sass-directory/styles.css

##Install Gulp

        $ sudo npm install -g gulp-sass
        $ sudo npm install gulp-sass
        $ sudo ionic setup sass
        $ sudo ionic serve
        
        
##Ionic live reload

Commands examples

        $ ionic emulate ios --livereload --consolelogs --serverlogs
        $ ionic run android -l -c -s
        
##Using Yeoman
What is Yeoman: Yeoman is a web scafforlding tool for modern web applications. Yeoman generator for creating Ionic hybrid mobile applications using AngularJS and Cordova - lets you quickly set up a project with sensible defaults and best practices.
Check out there website at http://yeoman.io/, and yo ionic on git at this address https://github.com/diegonetto/generator-ionic

###Installing yo 

        $ npm install -g yo
        
install ionic generator 

        $sudo npm install -g generator-ionic
        
Generate ionic project project

        $ yo ionic
        
##Deploy to Google Play Store

[Publishing your app]http://ionicframework.com/docs/guide/publishing.html

If you are about to upload a new version of the appliaction already on the Google play update app configuration file (config.xml) with version number.

```bash      
$ cordova build --release android
$ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/ant-build/[app_mame]-release-unsigned.apk alias_name
```
If you have already created a relase build of the app you move or rename the privious version of the app in this case we will just remove it.
```bash   
$ rm [app_mame].apk
$ zipalign -v 4 platforms/android/ant-build/[app_mame]-release-unsigned.apk [app_mame].apk
```

{unedited}
## Testing in a Browser

Use `ionic serve` to start a local development server for app dev and testing. This is useful for both desktop browser testing, and to test within a device browser which is connected to the same network. Additionally, this command starts LiveReload which is used to monitor changes in the file system. As soon as you save a file the browser is refreshed automatically. View [Using Sass](https://github.com/driftyco/ionic-cli/blob/master/README.md#using-sass) if you would also like to have `ionic serve` watch the project's Sass files.

```bash
$ ionic serve [options]
```

__LiveReload__

By default, LiveReload will watch for changes in your `www/` directory,
excluding `www/lib/`.  To change this, you can specify a `watchPatterns`
property in the `ionic.project` file located in your project root to watch
(or not watch) for specific changes.

```json
{
  "name": "myApp",
  "app_id": "",
  "watchPatterns": [
    "www/js/*",
    "!www/css/**/*"
  ]
}
```
For a reference on glob pattern syntax, check out
[globbing patterns](http://gruntjs.com/configuring-tasks#globbing-patterns) on
the Grunt website.

Note:

```bash
$ ionic setup sass
```

## Updating Ionic

Update Ionic library files, which are found in the `www/lib/ionic` directory. If bower is being used
by the project, this command will automatically run `bower update ionic`, otherwise this command updates
the local static files from Ionic's CDN.

```bash
$ ionic lib update
```
{unedited end}

##Creating search 

Angular filter 
https://docs.angularjs.org/api/ng/filter/filter

# Original
https://gist.github.com/denzildoyle/7ccf10aca191d0e42b7b