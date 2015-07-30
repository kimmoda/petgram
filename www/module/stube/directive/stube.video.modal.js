'use strict';
angular
    .module ('module.stube')
    .directive ('stubeVideo', function ($ionicModal, $rootScope, $timeout, $cordovaInAppBrowser, $ionicSlideBoxDelegate, Stube, Analytics) {
    return {
        restrict: 'A',
        template: '',
        link    : function ($scope, elem) {


            elem.bind ('click', function () {
                var video = $scope.video;
                Stube.addHistory (video);

                $scope.favority = Stube.getFavority (video);

                console.log (Stube.getFavority (video));

                $scope.video = video;

                $ionicModal.fromTemplateUrl ('module/stube/view/modal/stube.modal.video.html', {
                    scope: $scope
                }).then (function (modal) {
                    $scope.modal = modal;

                    $ionicSlideBoxDelegate.update ();
                    $timeout (function () {
                        $ionicSlideBoxDelegate.start ();
                    }, 1500);
                    $scope.modal.show ();
                });

                var data         = Stube.getData ();

                console.log (data.options);
                $scope.slideshow = {
                    autoPlay : data.options.autoPlay,
                    repeat   : data.options.repeat,
                    interval : data.options.interval,
                    showPager: data.options.showPager
                };

            });

            $rootScope.$on ('closeView', function (event, data) {
                $scope.modal.hide ();
                $cordovaInAppBrowser.close ();
            });

            $scope.closeModal = function () {
                $scope.modal.hide ();
                $scope.modal.remove ();
            };

            $scope.openVideo = function (video) {

                var options = {
                    location  : 'yes',
                    clearcache: 'yes',
                    toolbar   : 'yes'
                };


                $cordovaInAppBrowser.open ('http://stube.com.br/video.php?id=' + video.video_id + '&autostart=true', '_blank', options);
                Analytics.event ('Visualizar Vídeo', 'Play', 'Video', video.title);
            };

            $scope.set = function (key, value) {
                Stube.setSettting (key, value);
            };


            $scope.settings = function (key) {
                return Stube.setting (key);
            };

            $scope.slideChanged   = function (index) {
                if (index === $ionicSlideBoxDelegate.slidesCount () - 1) {
                    setTimeout (function () {
                        $ionicSlideBoxDelegate.slide (0);
                    }, $scope.settings ('interval'));

                }
            };
            $scope.favorityToggle = function (video) {
                $scope.favority = Stube.toggleFavority (video);
            };

        }
    };
});