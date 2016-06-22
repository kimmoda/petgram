(function () {
    'use strict';

    angular.module('app.main').controller('MainTabCtrl', MainTabController);

    function MainTabController($scope, ActionSheet, $q, Gallery, PhotoFilter, ParseFile, $ionicModal, Loading) {
        var vm       = this;
        var tempImage;

        window.StatusBar.styleDefault();

        vm.postPhoto = function () {
            ActionSheet
                .image()
                .then(function (image) {
                    tempImage = image;
                    //return PhotoFilter.load(image);
                    return image;
                })
                .then(modalPost)
                .then(function (form) {
                    //console.log('Cadastra na Galeria', form);
                    Loading.start();
                    ParseFile.upload({base64: form.image}).then(function (imageUploaded) {
                        form.image = imageUploaded;
                        Gallery.create(form).then(function (item) {
                            console.log(item);
                            $scope.$emit('photoInclude', item);
                            Loading.end();
                        });
                    });
                });


            function modalPost(image) {
                var defer    = $q.defer();
                $scope.image = image;
                $scope.form  = {
                    title: ''
                };

                $scope.editFilter = function () {
                    PhotoFilter.load(tempImage).then(function (image) {
                        $scope.image = image;
                    });
                };

                $ionicModal
                    .fromTemplateUrl('app/main/share/share-modal.html', {
                        scope          : $scope,
                        focusFirstInput: true
                    })
                    .then(function (modal) {
                        $scope.modalFilter = modal;
                        $scope.modalFilter.show();
                    });


                $scope.close = function () {
                    $scope.modalFilter.hide();
                };

                // Cleanup the modal when we're done with it!
                $scope.$on('$destroy', function () {
                    $scope.modal.remove();
                });

                $scope.submit = function () {
                    var form   = angular.copy($scope.form);
                    form.image = $scope.image;
                    tempImage  = '';
                    $scope.close();
                    defer.resolve(form);
                };

                return defer.promise;
            }
        };

    }
})();
