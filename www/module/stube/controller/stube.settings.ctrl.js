'use strict';
angular
    .module ('module.stube')
    .controller ('SettingsCtrl', function ($scope, $rootScope, $ionicModal, $cordovaInAppBrowser, $cordovaSocialSharing, Analytics, gettextCatalog) {

    Analytics.view ('Configurações');

    var self = this;

    self.languages      = $rootScope.langs;
    self.language       = $rootScope.lang;
    self.changeLanguage = function (language) {
        gettextCatalog.setCurrentLanguage (language);
    };

    var message = {
        title  : 'Conheça o STube, o app para vídeos adultos',
        image  : 'http://stube.com.br/images/screen1.jpg',
        link   : 'http://stube.com.br',
        subject: 'Um amigo indicou um app para você'
    };


    self.openSite = function () {
        var options = {
            location  : 'yes',
            clearcache: 'yes',
            toolbar   : 'yes'
        };

        $cordovaInAppBrowser.open ('http://stube.com.br', '_blank', options);
        Analytics.event ('Visualizar Vídeo', 'Play', 'Video', video.title);
    };

    // Share
    self.shareViaTwitter = function () {
        $cordovaSocialSharing
            .shareViaTwitter (message.text, message.image, message.link)
            .then (function (result) {
            // Success!
        }, function (err) {
            // An error occurred. Show a message to the user
        });

    };

    self.shareViaFacebook = function () {


        $cordovaSocialSharing
            .shareViaFacebook (message.text, message.image, message.link)
            .then (function (result) {
            // Success!
        }, function (err) {
            // An error occurred. Show a message to the user
        });
    };

    self.shareViaWhatsApp = function () {

        $cordovaSocialSharing
            .shareViaWhatsApp (message.text, message.image, message.link)
            .then (function (result) {
            // Success!
        }, function (err) {
            // An error occurred. Show a message to the user
        });
    };

    self.shareViaSMS = function () {
        $cordovaSocialSharing
            .shareViaSMS (message.title, null)
            .then (function (result) {
            // Success!
        }, function (err) {
            // An error occurred. Show a message to the user
        });
    };

    self.shareViaEmail = function () {
        $cordovaSocialSharing
            .shareViaEmail (message.title, message.subject)
            .then (function (result) {
            // Success!
        }, function (err) {
            // An error occurred. Show a message to the user
        });
    };
});