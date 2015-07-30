'use strict';
angular
    .module ('module.stube')
    .controller ('RedtubeSearchCtrl', function ($scope, $timeout, $ionicScrollDelegate, Notify, Analytics, Stube) {
    var self = this;

    self.focused = 'centered';

    Analytics.view ('Busca de Video');

    function init () {
        self.data = Stube.getData ();
        self.text = '';
        self.search ();
    }


    self.search = function (more) {
        Analytics.event ('Busca de Video', 'Pesquisa', 'Video', self.text);

        $ionicScrollDelegate.resize ();

        Stube.searchVideos (self.text, more)
            .then (function (resp) {
            console.log (resp);
        })
            .finally (function () {
            console.log ('carrega');
            $timeout (function () {
                console.log ('Vai');
                $ionicScrollDelegate.resize ();
            }, 1000);
            //$ionicScrollDelegate.scrollTop ();
            $scope.$broadcast ('scroll.infiniteScrollComplete');
            $scope.$broadcast ('scroll.refreshComplete');
        });

    };

    self.clean = function () {
        self.text = '';
        self.search ();
    }

    init ();

});