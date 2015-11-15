(function (window, angular, undefined) {
    'use strict';
    angular
        .module('app.photogram')
        .factory('PhotogramShare', PhotogramShareFactory);

    function PhotogramShareFactory (AppConfig, gettextCatalog, $ionicActionSheet, Notify, $cordovaSocialSharing) {

        var message = {
            title: gettextCatalog.getString('Join me from ') + AppConfig.app.name + '!',
            subject: gettextCatalog.getString("I'm at ") + AppConfig.app.name + '!. ' + gettextCatalog.getString(
                'Install the application and follow me!') + ' ' + AppConfig.app.url,
            image: AppConfig.app.image,
            link: AppConfig.app.url
        };


        function success () {
            Notify.alert({
                title: gettextCatalog.getString('Thanks'),
                text: gettextCatalog.getString('Thank you for sharing!!')
            });
        }

        function error (err) {
            console.error(err);
        }

        function share (social, option) {

            var detail = option ? option : message;

            switch (social) {
                case 'facebook':
                    $cordovaSocialSharing
                        .shareViaFacebook(detail.text, detail.image, detail.link)
                        .then(success, error);
                    break;

                case 'twitter':
                    $cordovaSocialSharing
                        .shareViaTwitter(detail.text, detail.image, detail.link)
                        .then(success, error);
                    break;

                case 'whatsapp':
                    $cordovaSocialSharing
                        .shareViaWhatsApp(detail.text, detail.image, detail.link)
                        .then(success, error);
                    break;

                case 'email':
                    $cordovaSocialSharing
                        .shareViaEmail(detail.title, detail.subject ? detail.subject : detail.title)
                        .then(success, error);
                    break;
            }
        }

        function open () {
            var modal = $ionicActionSheet
                .show({
                    buttons: [
                        {
                            text: '<i class="icon ion-social-facebook"></i>' + gettextCatalog.getString('Facebook')
                        },
                        {
                            text: '<i class="icon ion-social-twitter"></i>' + gettextCatalog.getString('Twitter')
                        },
                        {
                            text: '<i class="icon ion-social-whatsapp"></i>' + gettextCatalog.getString('Whatsapp')
                        },
                        {
                            text: '<i class="icon ion-email"></i>' + gettextCatalog.getString('Email')
                        }
                    ],
                    titleText: gettextCatalog.getString('Share'),
                    cancelText: gettextCatalog.getString('Cancel'),
                    cancel: function () {
                        return false;
                    },
                    buttonClicked: function (index) {
                        console.log(index);
                        switch (index) {
                            case 0:
                                share ('facebook');
                                break;
                            case 1:
                                share ('twitter');
                                break;
                            case 2:
                                share ('whatsapp');
                                break;
                            case 3:
                                share ('email');
                                break;
                        }
                        modal ();
                        //share(index);
                    }
                });

        }

        return {
            share: share,
            open: open
        };
    }

}) (window, window.angular);