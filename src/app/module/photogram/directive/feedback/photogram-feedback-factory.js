(function () {

    angular
        .module('app.photogram')
        .factory('PhotogramFeedback', PhotogramFeedback);

    function PhotogramFeedback($q, AppConfig, Photogram, $rootScope, PhotogramFeedbackForm, $ionicModal, Notify) {
        var path = AppConfig.path;

        return {
            modal: modal,
            submit: submit
        };
        function modal(gallery) {
            var $scope            = $rootScope.$new();
            $scope.submitFeedback = submitFeedback;
            $scope.closeModal     = closeModal;
            $scope.form           = {
                photogramId: gallery.id
            };

            function submitFeedback() {
                var dataForm = angular.copy($scope.form);
                submit(dataForm)
                    .then(function (resp) {
                        console.log(resp);
                        closeModal();
                    });
            }


            function closeModal() {
                $scope.modal.hide();
                $scope.modal.remove();
                delete $scope.modal;
            }

            $scope.formFields = PhotogramFeedbackForm.form;

            $ionicModal
                .fromTemplateUrl(path + '/module/feedback/view/feedback.modal.html', {
                    scope: $scope,
                    focusFirstInput: true
                })
                .then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });
        }


        function submit(form) {
            var defer = $q.defer();

            console.log(form);

            Photogram
                .find(form.photogramId)
                .then(function (Photogram) {
                    console.log(Photogram);
                    var Object = Parse.Object.extend('PhotogramFeedback');
                    var item   = new Object();

                    delete form.PhotogramId;

                    angular.forEach(form, function (value, key) {
                        item.set(key, value);
                    });

                    item.set('user', Parse.User.current());
                    item.set('Gallery', Photogram);

                    item
                        .save(null)
                        .then(function (resp) {
                            Notify.alert({
                                title: ('Thanks'),
                                text: ('Thanks for your Feedback')
                            });
                            defer.resolve(resp);
                        });
                });


            return defer.promise;
        }

    }



})();