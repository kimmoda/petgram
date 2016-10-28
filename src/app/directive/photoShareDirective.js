(function () {
    'use strict';

    angular.module('starter').directive('photoShare', photoShareDirective);

    function photoShareDirective(Loading) {
        return {
            restrict: 'A',
            scope   : {
                ngModel: '='
            },
            link    : photoShareLink
        };

        function photoShareLink($scope, elem, attr) {
            elem.bind('click', share);

            function share() {

                var options = {
                    message     : $scope.ngModel.user.get('name') + ' share ' + $scope.ngModel.title, // not supported on some apps (Facebook, Instagram)
                    subject     : 'ParseGram', // fi. for email
                    files       : [$scope.ngModel.image._url], // an array of filenames either locally or remotely
                    //url         : '',
                    chooserTitle: $scope.ngModel.title // Android only, you can override the default share sheet title
                }
                console.log($scope.ngModel);
                console.log(options);

                function onSuccess(result) {
                    console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
                    console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
                    Loading.end();
                }

                function onError(msg) {
                    console.log("Sharing failed with message: " + msg);
                    Loading.end();
                }

                if (window.cordova) {
                    Loading.start();
                    window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
                }
            }
        }
    }

})();