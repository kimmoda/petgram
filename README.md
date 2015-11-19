Photogram 1.3
===================
### Summary

[TOC]

# Important warning
Although this project be based on version 1.2, the code has changed a lot, became more organized and if you have already started another project, I advise you to do a version using the 1.3 and go moving slowly.

----------
## Release Notes 1.3
It is with great pleasure that I present the new version of Photogram ** **.

A much closer version of the original Instagram, you now have a resource to ** capture photos, the camera or gallery **, ** cut ** ** ** and apply to share ** ** filter after posting the photo all very easy to use and with a simple configuration.

Furthermore, the code matured too are now a standard for following codes ** ** angularjs, which makes it much better to give maintenance, view, study and with code reuse.

----------
# Let's start
To start we need to have a minimum knowledge of Ionic advise you to view the documentation:

> Http://ionicframework.com/docs/

----------
## Cloning of Github

First make the clone of this project to your machine using the command:

> Git clone https://github.com/photogram/ionic-app-parse.git photogram

Then type the following command to install the dependencies of the Node and Bower libraries
> Npm install

To run the project in your browser use the command
> Ionic serves

## Important Commands
Before starting this project is quite different from what you find on the Internet, I ask you to avoid the most edit the file ** www / index.html **, you may even be wondering, but all the files you create or edit the folder www, and even installing a new library in the bower, the Gulp has a command to update itself the ** ** index.html file of the project.

Let us know some commands

### Sass gulp: inject
This command serves to scour all sass files (.scss) in www / js folder and automatically places them in the main file sass to be compiled together.

### Gulp sass
This command is already the Ionic own, but sometimes need to run the previous command when you create or delete an sass file folder js

### Gulp inject
This command is one of the most important, with it you no longer need to be editing the index.html file of the project. This command automatically places the dependencies bower, js and css in the index.html file without adding the test files ending with * Spec.js

### Gulp prettify
This command is wondrous, simply serves to format your code, very important before a commit is to maintain the standard format of the project.

### Gulp translate
This command is used to scour all js files and html and look for items to be translated, after that it generates the files for translation in the folder translate ** / ** and ** a translation in the folder www / js / app.translate. js ** with translations in different languages.

To learn more visit: https://angular-gettext.rocketeer.be/

### Gulp
This command runs many others at the same time, is responsible for organizing the project and identify errors before compiling

### Gulp prod
Very important command before to deploy through its index.html file, it creates a build in dist / folder with compressed project by up to 95%, is absurd in size reduction and at the same time gain in performance.


## Setting

### Setting the Parse?
The application uses the Parse.com as its backend, ie the entire database, photos and analytics are configured in Parse.

The easiest way to start is by creating an account on Parse.com after sending your email to be downloaded a copy of Photogram blank, so you can make changes as desired.

The second way is by following the documentation, creating the "tables" in Parse.com and then setting up the keys in the file www / js / app.config.js

### Setting the Ionic Analytics?
Before configuring Ionic Analytics, you need to have an account at:

> Https://apps.ionic.io/apps

Then you need to type a command to start the application with integration with Ionic Analytics, but before that you need to rename the name of your project the following files:
> Folder name with the former application name: Photogram
> Application name in the file package.json
> Application name in bower.json file

And only then run the command in your terminal to configure

> io ionic init

And last des comment out the line in the file ** www / js / app.js **, to be activated Ionic Analytics.

> $ IonicAnalytics.register ();

### Setting Up Facebook?
Coming soon

## Deploy in Mobile
To deploy on mobile, you need to first add a platform and then install the plugins in which javascript connects with the native device feature

### Adding a new platform

To add a iOS platform type

> Ionic platform add ios

To add a Android platform type

> Add ionic platform android
>
### Installing Plugins
Copy and paste the following command in your terminal
> ionic plugin add com.ionic.keyboard
ionic plugin add-cord plug-camera
ionic cord plugin add-plugin-console
ionic plugin add-plugin-cord device
ionic plugin add-cord plug-file
ionic plugin add-cord plug-file-transfer 1.
ionic plugin add-cord plug-geolocation
ionic plugin add-cord plug-imagepicker
ionic plugin add-cord plug-inappbrowser
ionic plugin add-cord plug-splashscreen
ionic plugin add-cord plug-statusbar
ionic plugin add-cord plug-whitelist
ionic plugin add-cord plug-x-socialsharing

### Installing the Facebook plugin

# Publishing in Play Store for Android

## Creating an account

## Generating Certificate

## Making safely project Deploy

## Creating arts


# Publishing to iPhone at the Apple Store

## Creating an account

## Generating Certificate

## Making safely project Deploy

## Creating arts
