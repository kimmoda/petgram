'use strict';
angular
    .module ('module.miscellaneous')
    .controller ('InAppBrowserCtrl', function ($scope) {
    $scope.openBrowser = function () {
        window.open ('http://www.google.com', '_blank', 'location=yes');
    };
})