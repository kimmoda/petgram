(function (window, angular, undefined) {
    'use strict';
    angular
        .module('app.photogram')
        .controller('PhotogramHomeCtrl', PhotogramHomeCtrl)

    function PhotogramHomeCtrl($scope, $rootScope, $cordovaInAppBrowser, $stateParams, Photogram) {
        var vm     = this;
        vm.loading = true;
        vm.buySource    = buySource;
        vm.load         = load;
        vm.load($stateParams.reload);
        $scope.loadMore = loadMore;

        init();

        $rootScope.$on('PhotogramHome:reload', function () {
            init();
        });

        function init() {
            vm.data  = [];
            vm.page  = 0;
            vm.empty = false;
            vm.more  = false;
        }


        function loadMore(force) {
            console.log('Load More', vm.more);
            vm.load(force);
        }

        function buySource() {
            var options = {
                location  : 'yes',
                clearcache: 'yes',
                toolbar   : 'yes'
            };

            var lang = $rootScope.lang.value;
            var url  = 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=FAW4JZS7KJM5S';
            if (lang === 'pt_BR') {
                url = 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=FT5W6FJW5RAEN'
            }

            $cordovaInAppBrowser.open(url, '_blank', options);
        }

        function load(force) {
            console.log('Load ');

            if (force) {
                init();
            }

            Photogram
                .home(vm.page)
                .then(function (resp) {

                    console.log(resp);

                    vm.loading = false;

                    angular.forEach(resp, function (value, key) {
                        vm.data.push(value);
                    });

                    console.log('qtd', resp.length);

                    if (resp.length) {
                        vm.more = true;
                        vm.page++;
                    } else {
                        vm.empty = true;
                        vm.more  = false;
                    }
                })
                .then(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                })
                .catch(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    if (vm.data.length) {
                        vm.loading = false;
                        vm.page++;
                    } else {
                        vm.empty = true;
                        vm.loading = false;
                    }
                    vm.more = false;
                });
        }


    }

})(window, window.angular);