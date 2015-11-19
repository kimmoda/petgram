(function (window, angular, undefined) {
    'use strict';
    angular
        .module('app.photogram')
        .factory('PhotogramShare', PhotogramShareFactory);

    function PhotogramShareFactory (AppConfig, $q, gettextCatalog, $ionicActionSheet, Notify, $cordovaSocialSharing) {

        var message = {
            title: gettextCatalog.getString('Join me from ') + AppConfig.app.name + '!',
            subject: gettextCatalog.getString("I'm at ") + AppConfig.app.name + '!. ' + gettextCatalog.getString(
                'Install the application and follow me!') + ' ' + AppConfig.app.url,
            image: AppConfig.app.image,
            link: AppConfig.app.url
        };

        return {
            share: share,
            open: open
        };

        function share (social, option) {
            var defer = $q.defer();

            function success (resp) {
                Notify.alert({
                    title: gettextCatalog.getString('Thanks'),
                    text: gettextCatalog.getString('Thank you for sharing!!')
                });
                defer.resolve(resp);
            }

            function error (err) {
                console.error(err);
                defer.reject();
            }

            var detail = option ? option : message;

            switch (social) {
                case 'instagram':
                    window
                        .plugins
                        .socialsharing
                        .shareViaInstagram(message.text, message.image, message.link)
                        .then(success, error);
                    break;

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

            return defer.promise;
        }

        function open () {
            var modal = $ionicActionSheet
                .show({
                    buttons: [
                        {
                            text: '<i class="icon ion-social-instagram"></i>' + gettextCatalog.getString('Instagram')
                        },
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
                                share ('instagram');
                                break;
                            case 1:
                                share ('facebook');
                                break;
                            case 2:
                                share ('twitter');
                                break;
                            case 3:
                                share ('whatsapp');
                                break;
                            case 4:
                                share ('email');
                                break;
                        }
                        modal ();
                        //share(index);
                    }
                });

        }
    }

}) (window, window.angular);