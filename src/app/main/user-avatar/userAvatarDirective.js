(function () {
    'use strict';

    angular.module('app.main').directive('userAvatar', userAvatarDirective);

    function userAvatarDirective(ActionSheet, Loading, ParseFile, User) {
        return {
            restrict: 'A',
            scope   : {
                ngModel: '='
            },
            link    : function ($scope, elem) {

                elem.bind('click', openModal);

                function openModal() {
                    var tempImage;

                    ActionSheet.image().then(function (image) {
                        tempImage = image;
                        //return PhotoFilter.load(image);
                        return image;
                    }).then(function (form) {
                        $scope.loading = true;
                        ParseFile.upload({base64: form}).then(function (imageUploaded) {
                            User.setPhoto(imageUploaded).then(function (user) {
                                console.log(user);
                                $scope.ngModel = user.attributes.photo;
                                console.log(user.attributes.photo);
                                $scope.loading = false;
                            });
                        });
                    });
                }

            }
        };
    }

})();
