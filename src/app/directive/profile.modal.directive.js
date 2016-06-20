(function () {
    'use strict';
    angular.module('starter').directive('profileModal', profileModalDirective);

    function profileModalDirective($ionicModal, User) {

        return {
            restrict: 'A',
            scope   : {
                userObj: '=user'
            },
            link    : profileModalLink
        };

        function profileModalLink(scope, elem) {
            elem.bind('click', function () {

                User.getPublicData(scope.userObj).then(function (data) {
                    console.log(data);
                    scope.user = data;
                    openModal();
                });

            });

            function openModal() {

                console.log(scope.user.attributes);

                $ionicModal
                    .fromTemplateUrl('app/directive/profile-modal.html', {
                        scope: scope
                    })
                    .then(function (modal) {
                        scope.modalProfile  = modal;
                        scope.loadingFollow = true;
                        scope.changeTab     = changeTab;
                        scope.follow        = follow;
                        scope.closeModal    = closeModal;
                        scope.modalProfile.show();

                        changeTab('list');

                        function follow() {

                            scope.loadingFollow = true;
                            var status;

                            if (scope.user.follow) {
                                status = false;
                            } else {
                                status = true;
                            }

                            User.follow(status, scope.user).then(followResp);

                            function followResp(resp) {

                                console.log('Follow result', resp);
                                scope.user.follow   = status;
                                scope.loadingFollow = false;
                            }
                        }

                        function closeModal() {
                            delete scope.data;
                            scope.modalProfile.hide();
                        }
                    });

                // Cleanup the modal when we're done with it!
                scope.$on('$destroy', function () {
                    scope.modalProfile.remove();
                });
            }

            function changeTab(tab) {
                if (tab === 'list') {
                    scope.tab = {
                        list: true,
                        grid: false
                    };
                } else {
                    scope.tab = {
                        list: false,
                        grid: true
                    };
                }
            }


        }
    }

})();
