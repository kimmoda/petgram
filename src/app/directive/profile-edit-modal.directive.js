(function () {
    'use strict';

    angular.module('starter').directive('profileModalEdit', profileModalEditDirective);

    function profileModalEditDirective($ionicModal, User, Loading, UserForm, $state) {

        return {
            restrict: 'A',
            scope   : {
                user: '='
            },
            template: '',
            link    : function (scope, elem) {

                scope.linkFacebook        = linkFacebook;
                scope.logout              = logout;
                scope.submitUpdateProfile = submitUpdateProfile;
                scope.closeModal          = closeModal;

                elem.bind('click', openModal);
                function init() {
                    var user   = Parse.User.current().attributes;
                    scope.form = {
                        name    : user.name,
                        email   : user.email,
                        status  : user.status,
                        photo   : user.photo,
                        username: user.username,
                        gender  : user.gender,
                        facebook: user.facebook
                    };
                    console.log(scope.form);
                    scope.formFields = UserForm.profile;
                }


                function openModal() {

                    init();
                    $ionicModal.fromTemplateUrl('app/directive/profile-edit-modal.html', {
                        scope: scope
                    }).then(function (modal) {
                        scope.modal = modal;
                        scope.modal.show();
                    });

                    // Cleanup the modal when we're done with it!
                    scope.$on('$destroy', function () {
                        scope.modal.remove();
                    });

                }

                function logout() {
                    $state.go('logout');
                    scope.closeModal();
                }

                function linkFacebook() {
                    User.facebookLink().then(function (resp) {
                        console.log(resp);
                    });
                }

                function submitUpdateProfile() {
                    var dataForm = angular.copy(scope.form);
                    Loading.start();
                    User.update(dataForm).then(function (resp) {
                        console.log(resp);
                        scope.user = resp;
                        Loading.end();
                        scope.closeModal();
                    });
                }

                function closeModal() {
                    scope.modal.hide();
                }

            }
        };
    }

})();
