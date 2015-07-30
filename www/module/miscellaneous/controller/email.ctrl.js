'use strict';
angular
    .module ('module.miscellaneous')
    .controller ('SendMailCtrl', function ($scope) {
    $scope.sendMail = function () {
        cordova.plugins.email.isAvailable (
            function (isAvailable) {
                // alert('Service is not available') unless isAvailable;
                cordova.plugins.email.open ({
                    to     : 'envato@startapplabs.com',
                    cc     : 'hello@startapplabs.com',
                    // bcc:     ['john@doe.com', 'jane@doe.com'],
                    subject: 'Greetings',
                    body   : 'How are you? Nice greetings from IonFullApp'
                });
            }
        );
    };
})